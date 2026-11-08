# Admin Video — Browser Video Management System

Hệ thống quản trị thư viện video chạy hoàn toàn trên trình duyệt (Client-side Web Application), không yêu cầu máy chủ ứng dụng (backend server).

## 1. Thông tin thư mục dự án
- **Thư mục gốc:** `D:\vibe_dung vu\admin video`
- **Công nghệ sử dụng:** HTML5, CSS3 (Light Mode Design System), Vanilla JavaScript (ES6+ Modules), SQLite WASM (`sql.js`), IndexedDB (`video_admin_storage`), Chart.js.
- **Ràng buộc:** Không dùng backend (Node.js, Python, PHP), không dùng frontend framework (React, Vue), chạy tĩnh hoàn toàn.

## 2. Cấu trúc thư mục (Đã đồng bộ theo tên mới)
```text
admin video/
├── index.html                   # Dashboard (KPIs & Biểu đồ Chart.js)
├── videos.html                  # Danh sách video (Search, Filter, Sort, Pagination)
├── video-form.html              # Thêm / Chỉnh sửa video với Live Preview
├── categories.html              # Quản lý danh mục video
├── permissions.html             # Quản lý phân quyền (ADMIN / USER)
├── login.html                   # Đăng nhập (Local prototype)
├── register.html                # Đăng ký (Local prototype)
├── forgot-password.html         # Quên mật khẩu (Demo limitations)
├── README.md                    # Tài liệu giới thiệu & hướng dẫn dự án
├── assets/
│   ├── css/
│   │   ├── reset.css            # Base normalize & reset
│   │   ├── variables.css        # Design tokens Light Mode
│   │   ├── layout.css           # Bố cục Sidebar, Header, Responsive Drawer
│   │   ├── components.css       # Buttons, Cards, Table, Modals, Toasts
│   │   └── pages.css            # Styles riêng cho Auth, Live Preview
│   ├── js/
│   │   ├── app.js               # Entry point
│   │   ├── mock-data.js         # Dữ liệu mẫu (Videos, Categories)
│   │   ├── services/
│   │   │   └── permission-service.js # Dịch vụ quản lý tài khoản & phân quyền
│   │   ├── components/
│   │   │   ├── sidebar.js       # Navigation sidebar & mobile drawer
│   │   │   ├── header.js        # Header, mobile menu & action buttons
│   │   │   ├── modal.js         # Confirmation dialogs
│   │   │   └── toast.js         # Toast feedback notifications
│   │   └── pages/
│   │       ├── dashboard.js     # Logic Dashboard & Chart.js
│   │       ├── videos.js        # Logic Danh sách video & bộ lọc
│   │       ├── video-form.js    # Logic Form & Live Preview
│   │       ├── categories.js    # Logic Quản lý danh mục
│   │       ├── permissions.js   # Logic Quản lý phân quyền tài khoản
│   │       ├── login.js         # Logic Đăng nhập
│   │       ├── register.js      # Logic Đăng ký
│   │       └── forgot-password.js # Logic Khôi phục mật khẩu demo
├── database/
│   └── README.md                # Kiến trúc lưu trữ SQLite WASM & IndexedDB
└── docs/                        # Toàn bộ 8 tài liệu yêu cầu & kế hoạch dự án
```

## 3. Cách chạy ứng dụng
1. Mở thư mục `admin video` trong VS Code.
2. Nhấp chuột phải vào `index.html` và chọn **Open with Live Server**.
3. Ứng dụng sẽ mở tại `http://127.0.0.1:5500/index.html`.

## 4. Trạng thái tiến độ các Milestone
- [x] **Milestone 1 — Project Foundation**: Hoàn thành cấu trúc, 7 trang HTML, hệ thống CSS Light Mode, layout responsive, dữ liệu mẫu, biểu đồ Chart.js.
- [ ] **Milestone 2 — SQLite & Persistence**: Nạp engine SQLite WASM và lưu trữ IndexedDB.
- [ ] **Milestone 3 — Video CRUD**: Đọc/ghi video trực tiếp trên SQLite WASM.
- [ ] **Milestone 4 — Dashboard Analytics**: Tính toán KPI và Chart từ database SQLite.
- [ ] **Milestone 5 — Authentication Prototype**: Quản lý phiên và route guard client-side.
- [ ] **Milestone 6 — Quality Assurance**: Kiểm thử toàn diện và xử lý ngoại lệ.
