# 🚗 Bot Discord Ôn Thi Lý Thuyết Lái Xe Ô Tô (GPLX)

Chào mừng bạn đến với dự án Bot Discord giúp ôn tập và thi thử lý thuyết lái xe ô tô (hạng B1/B2) và xe máy (hạng A1) theo **bộ 600 câu hỏi mới nhất của Bộ Giao thông Vận tải & Bộ Công an**.

Bot hỗ trợ đầy đủ các tính năng tương tác trực quan bằng các nút bấm (Buttons) và giao diện thẻ nhúng (Embeds) vô cùng đẹp mắt, mô phỏng chân thực bài thi sát hạch lý thuyết.

---

## ✨ Các Tính Năng Nổi Bật

1.  **📖 Chế độ ôn tập (`/on-tap`):**
    *   Học viên có thể ôn tập theo từng chủ đề: *Luật giao thông*, *Biển báo*, *Giải thế sa hình*, hoặc *Câu hỏi điểm liệt*.
    *   Sau mỗi câu trả lời, bot sẽ lập tức phản hồi kết quả Đúng/Sai, hiển thị đáp án chuẩn kèm **giải thích chi tiết lý thuyết**.
    *   Tương tác mượt mà bằng nút bấm "Câu tiếp theo" để tự động tải câu hỏi mới.

2.  **⏱️ Phòng thi thử sát hạch (`/thi-thu`):**
    *   **Hạng B1 / B2:** Cấu trúc 35 câu làm trong 22 phút. Yêu cầu đúng >= 32 câu và không sai câu điểm liệt.
    *   **Hạng A1:** Cấu trúc 25 câu làm trong 19 phút. Yêu cầu đúng >= 21 câu và không sai câu điểm liệt.
    *   **Đồng hồ đếm ngược:** Đếm ngược thời gian làm bài chính xác, tự động nộp bài và khóa tương tác khi hết giờ.
    *   **Chấm điểm tự động:** Đưa ra kết quả **THI ĐẠT** hoặc **THI TRƯỢT**, cảnh báo đặc biệt nếu trượt do câu điểm liệt.
    *   **Xem lại bài thi:** Hiển thị danh sách các câu trả lời sai kèm đáp án đúng để học viên ôn tập lại.

3.  **📈 Bảng thống kê học tập (`/thong-ke`):**
    *   Ghi nhớ tiến độ học: Tổng số câu đã trả lời, tỉ lệ trả lời đúng.
    *   Thống kê lịch sử thi thử: Số đề đã thi, tỉ lệ đỗ/trượt cụ thể của từng học viên.

4.  **💡 Sổ tay hướng dẫn & Mẹo nhanh (`/help`):**
    *   Tổng hợp các mẹo nhận diện đáp án nhanh (ví dụ: các từ khóa "bị nghiêm cấm", "không được phép"...).
    *   Hướng dẫn quy chế thi thực tế.

---

## 🛠️ Hướng Dẫn Cài Đặt Chi Tiết

### 1. Tạo ứng dụng Bot trên Discord Developer Portal
1. Truy cập [Discord Developer Portal](https://discord.com/developers/applications).
2. Nhấn nút **New Application** ở góc trên cùng bên phải và đặt tên cho Bot (ví dụ: `Bot On Thi GPLX`).
3. Đi tới mục **Bot** ở menu bên trái:
   * Nhấn **Add Bot**.
   * Nhấn **Reset Token** để lấy Token của bot. Hãy sao chép Token này lại.
   * Cuộn xuống mục **Privileged Gateway Intents** và kích hoạt các quyền sau (bắt buộc):
     * `Presence Intent`
     * `Server Members Intent`
     * `Message Content Intent`
4. Đi tới mục **OAuth2** -> **General** ở menu bên trái:
   * Sao chép **Client ID** của bot.

### 2. Thiết lập môi trường dự án
1. Sao chép file `.env.example` thành file `.env`:
   ```bash
   cp .env.example .env
   ```
2. Mở file `.env` bằng trình chỉnh sửa và điền thông tin của bạn vào:
   ```env
   DISCORD_TOKEN=Token_của_bot_bạn_vừa_copy_ở_bước_trên
   CLIENT_ID=Client_ID_của_bot_bạn_vừa_copy_ở_bước_trên
   GUILD_ID=ID_của_server_discord_dành_cho_thử_nghiệm_(tùy_chọn)
   ```
   *(Lưu ý: Nếu điền `GUILD_ID`, các lệnh Slash Command sẽ xuất hiện ngay lập tức trên Server đó sau khi đăng ký. Nếu để trống, lệnh sẽ đăng ký toàn cầu và có thể mất tới 1 giờ để hiển thị trên tất cả server).*

### 3. Cài đặt các gói phụ thuộc và chạy bot
1. Cài đặt thư viện Node.js cần thiết:
   ```bash
   npm install
   ```
2. Đăng ký các lệnh Slash Command với Discord (chỉ cần chạy một lần đầu tiên hoặc khi bạn thay đổi cấu trúc lệnh):
   ```bash
   npm run register
   ```
3. Khởi động bot:
   ```bash
   npm start
   ```
   *(Khi màn hình hiển thị `✅ Bot Discord LTLX đã sẵn sàng!` là bot đã hoạt động thành công).*

### 4. Mời Bot vào máy chủ (Server) Discord của bạn
1. Quay lại Discord Developer Portal, đi tới mục **OAuth2** -> **URL Generator** của ứng dụng bot của bạn.
2. Trong phần **Scopes**, tích chọn: `bot` và `applications.commands`.
3. Trong phần **Bot Permissions**, tích chọn các quyền:
   * `Send Messages`
   * `Embed Links`
   * `Use External Emojis`
   * `Add Reactions`
   * `Read Message History`
4. Cuộn xuống cuối trang và sao chép đường link được tạo ra tại **Generated URL**.
5. Dán đường link đó vào trình duyệt, chọn server Discord của bạn và cấp quyền để mời bot vào.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
ltlx_bot/
├── data/
│   ├── questions.json     # Cơ sở dữ liệu chứa câu hỏi, biển báo, sa hình (JSON)
│   └── stats.json         # File lưu trữ tự động tiến độ & thống kê của người dùng
├── utils/
│   └── statsManager.js    # Tiện ích quản lý đọc/ghi thống kê học tập
├── .env.example           # File cấu hình mẫu môi trường
├── index.js               # Điểm khởi chạy bot chính & xử lý sự kiện
├── package.json           # Danh sách thư viện và scripts chạy dự án
├── register-commands.js   # Script dùng để đăng ký các lệnh Slash với Discord API
└── README.md              # Tài liệu hướng dẫn sử dụng bot
```

---

## ⚡ Các Lệnh Sử Dụng Trực Tiếp Trên Discord

Gõ các lệnh sau trong khung chat của Discord (nhớ bật tính năng lệnh Slash):

*   `/help` - Hiển thị hướng dẫn và các mẹo học lý thuyết lái xe hữu ích.
*   `/on-tap` - Lựa chọn chủ đề ôn thi (Luật giao thông, Biển báo, Sa hình, Điểm liệt, Ngẫu nhiên).
*   `/thi-thu` - Lựa chọn hạng bằng (A1 hoặc B1/B2) để bắt đầu thi thử tính giờ.
*   `/thong-ke` - Xem bảng điểm tích lũy và hiệu suất ôn luyện cá nhân của bạn.
