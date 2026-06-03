# Smart Human Detection Rescue Node

ESP32-S3-CAM edge device that detects human presence locally (YOLO11-Nano / ESP-DL) and publishes structured JSON alerts to AWS IoT Core via MQTT. A React dashboard displays real-time device state (**Searching** / **Detected**) and alert history with snapshot links.

**Live system flow:** ESP32 (camera + ultrasonic + YOLO inference) → IoT Core (MQTT publish) → Lambda (validate & fan-out) → Kinesis/SQS/SNS → Dashboard (WebSocket live updates).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Device (ESP32-S3)                       │
├─────────────────┬──────────────────┬──────────────────────────┤
│  Camera (OV2640)│ Ultrasonic (HC)  │   YOLO11-Nano (INT8)    │
│  + PSRAM buffer │  Distance sense  │   ~2 MB + inference     │
└────────┬────────┴──────────┬───────┴────────────┬─────────────┘
         │                   │                    │
         └───────────────────┼────────────────────┘
                     ┌───────▼──────────┐
                     │  State Machine   │
                     │ IDLE→ARMED→      │
                     │ DETECTED→IDLE    │
                     └───────┬──────────┘
                             │
         ┌───────────────────▼──────────────────┐
         │    MQTT Publish (X.509 cert)       │
         │ rescue/node/{id}/alert (QoS=1)    │
         └───────────────────┬──────────────────┘
                             │
        ┌────────────────────▼─────────────────┐
        │   AWS IoT Core (MQTT Broker)        │
        │   - Stores device shadow            │
        │   - Triggers IoT Rule               │
        └────────────────────┬─────────────────┘
                             │
        ┌────────────────────▼─────────────────┐
        │   IoT Rule (SQL: rescue/node/+/*)  │
        │   Selector: DeviceId partitioning  │
        └────────────────────┬─────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
    ┌─────────┐      ┌──────────────┐    ┌─────────────┐
    │ Lambda  │      │ Kinesis      │    │ SQS Queue   │
    │ alert-  │      │ Data Stream  │    │ (24 hr TTL) │
    │processor│      │              │    │             │
    └────┬────┘      └──────────────┘    └─────────────┘
         │
         ├──► S3 bucket (store snapshot URI)
         ├──► SNS topic (email alert)
         └──► WebSocket API (broadcast)
                      │
                      ▼
            ┌──────────────────────┐
            │   React Dashboard    │
            │ - StatusIndicator    │
            │ - AlertDisplay list  │
            │ - WebSocket listener │
            └──────────────────────┘
              (Cognito JWT + WS token)
```

## Team Roles & Responsibilities

| Role | Owner | Directory | Primary Files |
|------|-------|-----------|----------------|
| **Firmware Engineer** | Firmware | `firmware/` | `main.cpp`, `camera.h/cpp`, `ultrasonic.h/cpp`, `mqtt_client.h/cpp`, `sdkconfig.defaults` |
| **Embedded AI Specialist** | ML | `models/` | `export_yolo.py`, `quantize_int8.py`, calibration images |
| **Cloud Architect** | Infra | `infra/` | `bin/app.ts`, `lib/*.ts` (6 stacks), Lambda handlers |
| **Full-Stack Developer** | Web | `web/` | `src/App.tsx`, `store.ts`, `components/`, `api/client.ts`, env config |
| **Systems Lead / QA** | QA | `hardware/`, `docs/` | BOM, GPIO map, integration test scripts, latency measurements |

## Documentation Map

| Document | Audience | Contents |
|----------|----------|----------|
| **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** | All | Data flow, stack dependencies, device state machine, X.509 + Cognito JWT security model |
| **[DEVELOPMENT.md](docs/DEVELOPMENT.md)** | All | Role-by-role setup, file maps, first-run commands, integration workflows |
| **[CODEMAPS.md](docs/CODEMAPS.md)** | All | One-line file reference for all 40+ implementation files |
| **[mqtt-contract.md](docs/mqtt-contract.md)** | Firmware + Cloud | Cross-layer MQTT spec: topics, payloads, QoS (freeze Week 2) |
| **[cdk-outputs.md](docs/cdk-outputs.md)** | All | Fill after deploy: IoT endpoint, API URLs, pool IDs for firmware + frontend |
| **[hardware/README.md](hardware/README.md)** | QA + Firmware | BOM (~500K VND), GPIO map (TBD pins), enclosure STL path |
| **[models/README.md](models/README.md)** | ML + Firmware | YOLO11 export → ONNX → INT8 quantization workflow, memory budget |

## Quick Start by Role

### Cloud Architect (Infra)
```bash
cd infra
npm install
cdk bootstrap                    # once per account/region
cdk synth                        # verify all 6 stacks
cdk deploy --all                 # deploys to dev
# Fill docs/cdk-outputs.md with outputs — distribute to team
```

### Full-Stack Developer (Web)
```bash
cd web
npm install
# Copy .env.local from cdk-outputs.md template
VITE_USER_POOL_ID=... VITE_API_URL=... npm run dev  # http://localhost:5173
```

### Firmware Engineer (Embedded)
```bash
cd firmware
idf.py set-target esp32s3
idf.py menuconfig              # Wi-Fi SSID/pass, MQTT endpoint from cdk-outputs, Device ID
idf.py build flash monitor      # connect ESP32-S3-CAM via USB
```

### Embedded AI Specialist (Models)
```bash
cd models
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python export_yolo.py --weights yolo11n.pt --output ./exported
mkdir calibration_images  # add 50–100 photos of people
python quantize_int8.py --model ./exported/yolo11n.onnx --calibration ./calibration_images
# Hand yolo11n_int8.onnx to firmware engineer for esp-dl conversion
```

### Systems Lead / QA (Hardware & Integration)
1. **Week 1:** Order ESP32-S3 kit + HC-SR04, confirm GPIO map in `hardware/README.md`
2. **Week 3:** Run integration test script (TODO: add to repo)
3. **Week 4:** Measure latency: device publish → CloudWatch → UI (target < 2 s)

## Key Contracts

### MQTT (Device → Cloud)
See **[mqtt-contract.md](docs/mqtt-contract.md)**
- Topics: `rescue/node/{deviceId}/alert` (QoS=1), `rescue/node/{deviceId}/status` (QoS=0)
- Auth: X.509 per-device certificate (issued by IoT Core)
- Alert payload includes: deviceId, confidence, timestamp (ISO-8601 UTC), inferenceMs, optional snapshotUri

### API (Web → Cloud)
- **REST** (Cognito JWT auth):
  - `GET /alerts` → returns recent alerts from DB
  - `GET /devices` → lists registered IoT Things
- **WebSocket** (Cognito JWT): subscribe to real-time alert broadcasts

### State Machine (Firmware)
```
IDLE ──distance < threshold──► ARMED ──inference ≥ 0.75──► DETECTED ──10 s debounce──► IDLE
 ▲                                                             │
 │                                                             │
 └──────────────────────────────────────────────────────────┘
```

## Secrets & Credentials

| Secret | Producer | Storage | Notes |
|--------|----------|---------|-------|
| Wi-Fi SSID / pass | Setup | ESP32 NVS | Never commit `sdkconfig` (only `sdkconfig.defaults`) |
| AWS IoT cert (`.pem`) | IoT Core | `firmware/certs/` (gitignored) | Download after first device provisioning |
| JWT token | Cognito | Browser local storage | Used for REST + WebSocket auth |
| API keys | N/A | Environment only | None hardcoded in repo |

## Branching & Code Review

- **Main branch protection:** All PRs require 1 approver from a **different discipline** (e.g., firmware PR reviewed by cloud)
- **Branch naming:** `feat/<role>-<topic>` (e.g., `feat/firmware-mqtt-retry`, `feat/web-alert-display`)
- **Commit style:** Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
- **Code review priority:**
  1. Security (auth, secrets, input validation)
  2. MQTT/API contract compliance
  3. Code quality (immutability, error handling, test coverage)

## Week-by-Week Milestones

| Week | Infra | Firmware | ML | Web | QA |
|------|-------|----------|----|----|-----|
| **1** | Bootstrap + synth 6 stacks | Order HW, GPIO confirm | Download yolo11n.pt | Setup Vite dev | Unbox + identify spare |
| **2** | Deploy, populate cdk-outputs | Menu config, MQTT endpoint handoff | Export ONNX, validate | Cognito login form | GPIO soldering |
| **3** | Lambda handlers (stubs) | Camera + inference plumbing | Quantize INT8, calibrate | WS connect, state atoms | Integration test script |
| **4** | DynamoDB for alert DB, S3 snapshot URL generation | Inference loop working, real alerts publishing | Tune threshold, FPS target | AlertDisplay + history | Latency measurement |
| **5** | Snapshot URI back-fill | Full state machine + debounce | Optimize memory usage | Full dashboard layout | Stress test (100 alerts/min) |

## File Tree

```
iot-ml-app/
├── README.md                               # You are here
├── docs/
│   ├── ARCHITECTURE.md                     # System design (data flow, stacks, security)
│   ├── DEVELOPMENT.md                      # Role-by-role setup guides
│   ├── CODEMAPS.md                         # One-line reference for every file
│   ├── mqtt-contract.md                    # MQTT spec (QoS, payloads, topics)
│   └── cdk-outputs.md                      # CDK deploy outputs (fill after deploy)
├── infra/
│   ├── bin/app.ts                          # CDK app entry; instantiates 6 stacks
│   ├── lib/
│   │   ├── auth-stack.ts                   # Cognito User Pool + App Client
│   │   ├── iot-stack.ts                    # IoT Core Thing policy
│   │   ├── data-stack.ts                   # Kinesis + SQS + SNS + S3
│   │   ├── compute-stack.ts                # 3 Lambda functions + IAM roles
│   │   ├── api-stack.ts                    # API Gateway REST + WebSocket
│   │   └── web-stack.ts                    # S3 static site + CloudFront
│   ├── lambda/
│   │   ├── alert-processor/index.ts        # IoT Rule target: validate & fan-out
│   │   ├── api-handler/index.ts            # REST /alerts, /devices
│   │   └── ws-handler/index.ts             # WebSocket $connect/$disconnect/default
│   ├── package.json
│   ├── tsconfig.json
│   └── cdk.json
├── web/
│   ├── src/
│   │   ├── main.tsx                        # React entry
│   │   ├── App.tsx                         # Root; auth check
│   │   ├── store.ts                        # Jotai atoms (auth, deviceState, alerts)
│   │   ├── auth/AuthModal.tsx              # Cognito login form
│   │   ├── components/
│   │   │   ├── Dashboard.tsx               # Main view: WS listener, state broadcast
│   │   │   ├── StatusIndicator.tsx         # Animated state badge
│   │   │   ├── AlertDisplay.tsx            # Single alert card
│   │   │   ├── Dashboard.module.css
│   │   │   ├── StatusIndicator.module.css
│   │   │   └── AlertDisplay.module.css
│   │   ├── api/
│   │   │   └── client.ts                   # Axios HTTP + WebSocket factory
│   │   └── ...
│   ├── .env.local.example                  # Template (fill from cdk-outputs)
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── firmware/
│   ├── main/
│   │   ├── main.cpp                        # app_main: state machine loop
│   │   ├── camera.h / camera.cpp           # OV2640 capture
│   │   ├── ultrasonic.h / ultrasonic.cpp   # HC-SR04 distance measurement
│   │   ├── mqtt_client.h / mqtt_client.cpp # X.509 MQTT client
│   │   ├── CMakeLists.txt
│   │   └── sdkconfig.defaults              # Safe ESP-IDF defaults (commit this)
│   ├── certs/                              # (gitignored) Device .pem files go here
│   ├── CMakeLists.txt
│   └── idf_component.yml
├── models/
│   ├── export_yolo.py                      # YOLO11 → ONNX
│   ├── quantize_int8.py                    # ONNX → INT8 quantized
│   ├── requirements.txt
│   ├── README.md                           # Workflow, calibration, memory budget
│   └── exported/                           # (build artifact) .onnx files go here
├── hardware/
│   ├── README.md                           # BOM, GPIO map, enclosure requirements
│   ├── enclosure/                          # (TODO) STL files for 3D printing
│   └── wiring/                             # (TODO) Schematic / diagrams
└── .gitignore                              # Ignores: sdkconfig, certs/, .venv/, .env.local
```

## Next Steps

1. **Infra**: `cdk deploy --all`, populate `docs/cdk-outputs.md`
2. **Firmware + Web**: Use cdk-outputs to configure MQTT endpoint and API URLs
3. **All**: Read `docs/ARCHITECTURE.md` and `docs/DEVELOPMENT.md` for role-specific depth
4. **Week 2**: Freeze MQTT contract in `docs/mqtt-contract.md`
