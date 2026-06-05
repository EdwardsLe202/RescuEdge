# RescuEdge - Hệ thống Giám sát Thiên tai & Điều phối Cứu hộ AI Thời gian thực

**RescuEdge** là một nền tảng giám sát thiên tai, sự cố khẩn cấp thông minh tích hợp trí tuệ nhân tạo (AI) thời gian thực và quản lý điều phối cứu hộ tại Việt Nam. Dự án được thiết kế với giao diện hiện đại, trực quan, tối ưu hóa trải nghiệm người dùng theo các tiêu chuẩn thẩm mỹ cao cấp (Sử dụng gam màu chủ đạo Xanh Cổ Vịt `#00505b`, Xanh Ngọc `#00d084` và Xám Sáng `#f8fafc`).

---

## 🚀 Tính năng nổi bật

1. **Dashboard Giám sát Camera AI**:
   - Live stream camera giám sát với tính năng giả lập luồng AI phát hiện sự cố.
   - Bảng điều khiển IoT Shadow State thời gian thực (Bật/tắt cảm biến camera, đổi chế độ hoạt động, kéo thanh trượt điều chỉnh ngưỡng độ tin cậy của AI).
   - Dòng thời gian phân đoạn sự kiện khẩn cấp (Timeline Event Segments) trực quan.

2. **Bản đồ Vệ tinh Điều phối Cứu hộ (Dispatch System)**:
   - Tích hợp bản đồ vệ tinh ESRI Satellite & Bản đồ địa giới hành chính qua Leaflet Map API.
   - Tải dữ liệu thiên tai thời gian thực toàn cầu từ **NASA EONET API** (Bão, Lũ lụt, Sạt lở đất, Núi lửa...).
   - Hỗ trợ chọn nhanh tọa độ trực tiếp trên bản đồ vệ tinh bằng cách nhấp chuột để điều phối lực lượng.
   - Form gửi lực lượng cứu hộ (Cảnh sát, Phòng cháy chữa cháy, Cứu hộ y tế) kèm lựa chọn số lượng nạn nhân, mức độ nguy hiểm và mô tả sự cố khẩn cấp.

3. **Lịch sử Cảnh báo AI (Alerts History)**:
   - Lưu trữ và phân tích các sự cố do AI phát hiện dưới dạng bảng dữ liệu chi tiết kèm hình ảnh snapshot (độ tin cậy AI, khoảng cách, thời gian xử lý inference).
   - Bộ lọc thông minh theo tên thiết bị camera và thanh trượt lọc theo mức độ tin cậy tối thiểu.

4. **Đa ngôn ngữ & Tương tác trơn tru**:
   - Chuyển đổi ngôn ngữ Tiếng Việt (VI) và Tiếng Anh (EN) bằng nút gạt trượt capsule mượt mà trên header.
   - Bảng chat log (Comments Sidebar) giúp các điều phối viên trao đổi ghi chú khẩn cấp.
   - Thiết kế giao diện không bị giật lag khung hình khi chuyển tab nhờ cấu trúc CSS chuẩn và thuộc tính focus tùy biến.

---

## 🛠️ Công nghệ sử dụng

- **Frontend Framework**: [Next.js 15+](https://nextjs.org/) (Sử dụng App Router và Server/Client Components linh hoạt)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/) (Đảm bảo an toàn kiểu dữ liệu và tự động gợi ý code)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Xây dựng hệ thống UI tùy biến nhanh, responsive mượt mà)
- **State & Data Fetching**: [TanStack Query v5 (React Query)](https://tanstack.com/query/latest) (Tối ưu hóa caching, fetch dữ liệu IoT shadow và danh sách thiết bị)
- **Map Integration**: [Leaflet JS](https://leafletjs.org/) & Leaflet CSS (Tích hợp bản đồ vệ tinh ESRI mượt mà, định vị marker động)
- **Icons**: [Lucide React](https://lucide.dev/) (Bộ icon vector tối giản, sắc nét)
- **Real-time Engine**: WebSockets & Giả lập kết nối WebSocket Hook
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/introduction)

---

## 📁 Cấu trúc thư mục dự án

```text
RescuEdge/
├── public/                      # Thư mục chứa ảnh tĩnh, logo, biểu tượng bản đồ
├── src/
│   ├── app/                     # Next.js App Router (Layouts & Pages)
│   │   ├── globals.css          # Định nghĩa biến màu CSS theme và hiệu ứng animations
│   │   ├── page.tsx             # File điều hướng trung tâm (Dashboard, Recordings, Alerts, Dispatch)
│   │   └── providers.tsx        # Cung cấp React Query client & Auth Session
│   ├── components/              # Các UI Component độc lập, tái sử dụng
│   │   ├── Header.tsx           # Thanh header chứa Tìm kiếm (⌘+F), Nút chuyển ngôn ngữ VI/EN dạng trượt, Notifications
│   │   ├── Sidebar.tsx          # Thanh menu bên trái (Chuyển trang chính, danh sách thiết bị IoT kèm dung lượng pin)
│   │   ├── MetricCards.tsx      # Thẻ thống kê động (Tổng sự cố, Trạng thái online, Cảnh báo gần nhất)
│   │   ├── VideoPlayer.tsx      # Trình xem camera AI & Shadow State control panel
│   │   ├── TimelineFlow.tsx     # Dòng thời gian phân đoạn AI phát hiện sự kiện
│   │   ├── AlertsFeed.tsx       # Bảng tin nhận dạng sự cố khẩn cấp thời gian thực
│   │   ├── SendingUnits.tsx     # Module vệ tinh Leaflet Map, NASA API & Form gửi cứu hộ
│   │   ├── RescueRadar.tsx      # Radar mô phỏng quét quét AI
│   │   └── CommentsSidebar.tsx  # Hộp thoại chat note nội bộ của điều phối viên
│   ├── hooks/
│   │   ├── useLanguage.tsx      # Quản lý đa ngôn ngữ VI / EN
│   │   └── useWebSocket.tsx     # Kết nối truyền tin cảnh báo khẩn cấp thời gian thực
│   ├── queries/                 # Các react-query hooks tương tác APIs
│   ├── types/                   # Định nghĩa TypeScript Interfaces cho thiết bị/cảnh báo
│   └── utils/                   # Hàm trợ giúp tiện ích (Helper functions)
├── package.json                 # Định nghĩa các package phụ thuộc và scripts chạy
├── tsconfig.json                # Cấu hình TypeScript
└── next.config.ts               # Cấu hình Next.js
```

---

## ⚙️ Hướng dẫn khởi chạy dự án

### 1. Cài đặt các thư viện phụ thuộc:
```bash
yarn install
# hoặc
npm install
```

### 2. Chạy ứng dụng ở chế độ phát triển (Development Mode):
```bash
yarn dev
# hoặc
npm run dev
```
Mở đường dẫn [http://localhost:3000](http://localhost:3000) trên trình duyệt của bạn để kiểm tra kết quả ứng dụng.

### 3. Biên dịch phiên bản chạy thực tế (Production Build):
```bash
yarn build
yarn start
```
Dự án được cấu hình kiểm tra TypeScript chặt chẽ và tối ưu hóa tài nguyên trước khi xuất bản bản build chính thức.
