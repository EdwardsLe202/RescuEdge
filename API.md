# API Reference

This document describes the APIs currently implemented by the CDK/Lambda stack. It is based on the deployed API Gateway routes in `infra/lib/api_stack.py` and the Lambda handlers under `infra/lambda/`.

There is currently no Swagger/OpenAPI spec in this repository. `infra/api_requirement.md` is a requirements/planning document, not the live API contract.

## Base URLs

Get these from CloudFormation stack outputs:

| Stack | Output | Purpose |
| --- | --- | --- |
| `RescueNode-Api-dev` | `RestApiUrl` | REST API base URL |
| `RescueNode-Api-dev` | `WsApiUrl` | WebSocket API base URL |
| `RescueNode-Auth-dev` | `UserPoolId` | Cognito user pool |
| `RescueNode-Auth-dev` | `UserPoolClientId` | Cognito app client |

Current API stack outputs:

| Output | Value |
| --- | --- |
| `RestApiEndpoint0551178A` | `https://y1z8g07tn9.execute-api.us-east-1.amazonaws.com/prod/` |
| `RestApiUrl` | `https://y1z8g07tn9.execute-api.us-east-1.amazonaws.com/prod/` |
| `WsApiUrl` | `wss://r93wmiexz1.execute-api.us-east-1.amazonaws.com/dev` |

Examples in this file use:

```text
REST_BASE=https://y1z8g07tn9.execute-api.us-east-1.amazonaws.com/prod
WS_BASE=wss://r93wmiexz1.execute-api.us-east-1.amazonaws.com/dev
```

The REST API stage is already included in `RestApiUrl`, so call routes as:

```text
https://y1z8g07tn9.execute-api.us-east-1.amazonaws.com/prod/api/v1/alerts
```

Note: the REST output uses stage `prod`, while the WebSocket output uses stage `dev`. Keep frontend environment variables aligned with the exact CloudFormation outputs.

## Authentication

### REST API

REST routes are protected by a Cognito User Pool authorizer. Send a Cognito JWT in the `Authorization` header:

```http
Authorization: Bearer <id_or_access_token>
```

### WebSocket API

WebSocket `$connect` uses a Lambda authorizer that reads the JWT from the `token` query parameter:

```text
wss://r93wmiexz1.execute-api.us-east-1.amazonaws.com/dev?token=<jwt>
```

Current limitation: the authorizer only decodes the JWT payload and does not verify the signature against Cognito JWKS yet. Do not treat this as production-grade auth.

## REST Endpoints

### List Alerts

```http
GET /api/v1/alerts
```

Reads from DynamoDB table `rescue-node-alerts-<stage>`.

Query parameters:

| Name | Required | Description |
| --- | --- | --- |
| `deviceId` | No | When present, queries alerts by device using `deviceId-timestamp-index`. |
| `limit` | No | Max number of alerts. Defaults to `50`. |

Response:

```json
{
  "alerts": [
    {
      "alertId": "alert-123",
      "deviceId": "device-001",
      "timestamp": "2026-06-04T13:00:00Z",
      "distance": "120",
      "confidence": "0.91",
      "inferenceMs": 42,
      "snapshotKey": "snapshots/device-001/alert-123.jpg",
      "snapshotUrl": "https://presigned-s3-url"
    }
  ],
  "count": 1
}
```

Notes:

- If `snapshotKey` exists, Lambda adds `snapshotUrl` as a presigned S3 GET URL.
- Snapshot URLs expire after 900 seconds.
- Without `deviceId`, this route performs a DynamoDB scan. That is acceptable for dev, but not for large production data.

Example:

```bash
curl -H "Authorization: Bearer $TOKEN"   "$REST_BASE/api/v1/alerts?deviceId=device-001&limit=25"
```

### List Devices

```http
GET /api/v1/devices
```

Reads from DynamoDB table `rescue-node-devices-<stage>`.

Query parameters:

| Name | Required | Description |
| --- | --- | --- |
| `status` | No | Filters devices by status. |

Response:

```json
{
  "devices": [
    {
      "deviceId": "device-001",
      "status": "detected",
      "battery": 87,
      "signalStrength": -62,
      "lastSeen": "2026-06-04T13:00:00Z"
    }
  ]
}
```

Example:

```bash
curl -H "Authorization: Bearer $TOKEN"   "$REST_BASE/api/v1/devices?status=online"
```

### Update Device Desired State

```http
PATCH /api/v1/devices/{deviceId}
```

Updates the AWS IoT Thing Shadow desired state for the device. This route does not directly update the devices DynamoDB table. DynamoDB is updated later when the device reports status or alert events through IoT.

Request body:

```json
{
  "mode": "live",
  "cameraEnabled": true,
  "alertThreshold": 0.85
}
```

Lambda writes this to IoT as:

```json
{
  "state": {
    "desired": {
      "mode": "live",
      "cameraEnabled": true,
      "alertThreshold": 0.85
    }
  }
}
```

Response:

```json
{
  "deviceId": "device-001",
  "desired": {
    "mode": "live",
    "cameraEnabled": true,
    "alertThreshold": 0.85
  }
}
```

Example:

```bash
curl -X PATCH   -H "Authorization: Bearer $TOKEN"   -H "Content-Type: application/json"   -d '{"mode":"live","cameraEnabled":true}'   "$REST_BASE/api/v1/devices/device-001"
```

### Get Video Stream URL

```http
GET /api/v1/video/stream-url/{deviceId}
```

Returns a presigned S3 GET URL for the latest live frame uploaded by the device.

S3 object key:

```text
live/{deviceId}/stream.jpg
```

Response:

```json
{
  "deviceId": "device-001",
  "streamUrl": "https://presigned-s3-url",
  "expiresIn": 3600
}
```

Frontend usage:

1. Call this endpoint with a Cognito token.
2. Use `streamUrl` as an image/video frame source.
3. Refresh the URL before `expiresIn` elapses.

Example:

```bash
curl -H "Authorization: Bearer $TOKEN"   "$REST_BASE/api/v1/video/stream-url/device-001"
```

## WebSocket API

Connect to:

```text
<WsApiUrl>?token=<jwt>
```

Routes:

| Route | Handler behavior |
| --- | --- |
| `$connect` | Validates token, stores `connectionId` in DynamoDB `rescue-node-connections-<stage>`. |
| `$disconnect` | Deletes `connectionId` from the connections table. |
| `$default` | Acknowledges messages with `200 OK`; clients are not expected to send app messages. |

Server-pushed events are sent by `rescue-node-alert-processor-<stage>` to all stored connections.

### `NEW_ALERT`

Sent when an alert payload is received from IoT.

```json
{
  "type": "NEW_ALERT",
  "payload": {
    "alertId": "alert-123",
    "deviceId": "device-001",
    "timestamp": "2026-06-04T13:00:00Z",
    "confidence": 0.91,
    "snapshotKey": "snapshots/device-001/alert-123.jpg",
    "snapshotUrl": "https://presigned-s3-url"
  }
}
```

### `DEVICE_STATUS_CHANGED`

Sent when a device status payload is received from IoT.

```json
{
  "type": "DEVICE_STATUS_CHANGED",
  "payload": {
    "deviceId": "device-001",
    "status": "online",
    "battery": 87,
    "lastSeen": "2026-06-04T13:00:00Z"
  }
}
```

## Device/IoT Data Ingestion

These are not frontend REST endpoints, but they feed the API data.

IoT rules in `IotStack` invoke Lambda functions for these MQTT topics:

| MQTT topic | Lambda | Effect |
| --- | --- | --- |
| `rescue/node/+/alert` | `rescue-node-alert-processor-<stage>` | Writes alert to DynamoDB, updates device status, sends SQS/SNS, broadcasts WebSocket event. |
| `rescue/node/+/status` | `rescue-node-alert-processor-<stage>` | Updates device status in DynamoDB and broadcasts WebSocket event. |
| `rescue/node/+/stream/token-request` | `rescue-node-stream-signer-<stage>` | Generates an S3 presigned PUT URL and publishes it to the device. |

Stream signer response topic:

```text
rescue/node/{deviceId}/stream/token-response
```

The response contains:

```json
{
  "uploadUrl": "https://presigned-s3-put-url"
}
```

The device should PUT JPEG frames to:

```text
s3://rescue-node-snapshots-<stage>-<account>/live/{deviceId}/stream.jpg
```

The frontend loads that object through `GET /api/v1/video/stream-url/{deviceId}`.

## Error Responses

The API handler returns JSON errors:

```json
{
  "error": "message"
}
```

Known statuses:

| Status | Cause |
| --- | --- |
| `400` | Missing request body or invalid JSON for `PATCH /devices/{deviceId}`. |
| `404` | No route matched the Lambda dispatcher. |

## Implementation Map

| Area | File |
| --- | --- |
| REST/WebSocket routes | `infra/lib/api_stack.py` |
| DynamoDB/S3/SQS/SNS resources | `infra/lib/data_stack.py` |
| Lambda permissions/env vars | `infra/lib/compute_stack.py` |
| REST Lambda implementation | `infra/lambda/api-handler/index.py` |
| Alert/status ingestion | `infra/lambda/alert-processor/index.py` |
| WebSocket connection storage | `infra/lambda/ws-handler/index.py` |
| WebSocket token authorizer | `infra/lambda/ws-authorizer/index.py` |
| S3 upload URL signer for devices | `infra/lambda/stream-signer/index.py` |
