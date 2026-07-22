# 🚗 Bot Discord Ôn Thi Lý Thuyết Lái Xe Ô Tô Hạng B2 (Trọn Bộ 600 Câu Hỏi GTVT)

Chương trình Bot Discord hỗ trợ học tập, ôn luyện và thi thử lý thuyết lái xe ô tô hạng B2 theo **bộ 600 câu hỏi sát hạch mới nhất của Bộ GTVT & Cục Đường bộ Việt Nam**.

Bot hỗ trợ đầy đủ các tính năng tương tác trực quan bằng các nút bấm (Buttons), thẻ nhúng (Embeds) đẹp mắt, đếm ngược thời gian thi thực tế và liên kết tới file PDF nguồn đối chiếu.

---

## ⚡ Quick Setup Tự Động (macOS / Linux / Termux Android)

Chỉ cần sao chép **1 dòng lệnh duy nhất** bên dưới dán vào màn hình Terminal (hoặc Termux trên Android) để cài đặt tự động:

```bash
bash <(curl -sSL https://raw.githubusercontent.com/thucho0103/ltlx-bot/main/setup.sh)
```

Hoặc nếu đã clone repository về máy:
```bash
chmod +x setup.sh && ./setup.sh
```

> **Hỗ trợ đầy đủ**:
> - **macOS** (zsh / bash)
> - **Linux** (Ubuntu / Debian / Arch / Alpine)
> - **Termux Android** (Tự động cập nhật `pkg`, tự động cài `nodejs-lts` & `git`)

---

## ✨ Các Tính Năng Nổi Bật

1. **📖 Ôn tập theo 7 chủ đề chuẩn (`/on-tap`):**
   - **Luật giao thông đường bộ** (166 câu)
   - **Nghiệp vụ vận tải** (26 câu)
   - **Văn hóa & Đạo đức người lái xe** (21 câu)
   - **Kỹ thuật lái xe ô tô** (56 câu)
   - **Cấu tạo & Sửa chữa ô tô** (35 câu)
   - **Hệ thống biển báo đường bộ** (182 câu)
   - **Giải thế sa hình** (114 câu)
   - **60 câu hỏi điểm liệt** (Bị trượt ngay nếu chọn sai)
   - Phản hồi đáp án tức thì, kèm lời giải thích lý thuyết chi tiết & **Nút mở File PDF nguồn đối chiếu**.

2. **⏱️ Thi thử sát hạch Hạng B2 (`/thi-thu`):**
   - Đề thi chuẩn 35 câu ngẫu nhiên làm trong **22 phút**.
   - Tự động lồng ghép **4 câu điểm liệt** theo tiêu chuẩn Bộ GTVT.
   - Đồng hồ đếm ngược thời gian làm bài, tự động nộp khi hết giờ.
   - Đánh giá **THI ĐẠT** (>= 32/35 câu & không sai câu điểm liệt) hoặc **THI TRƯỢT**.
   - Xem lại chi tiết các câu đã chọn sai để rút kinh nghiệm.

3. **📊 Bảng thống kê cá nhân (`/thong-ke`):**
   - Theo dõi số câu đã làm, tỉ lệ trả lời đúng và lịch sử số đề thi đã ĐẠT/TRƯỢT.

4. **📄 Nguồn dữ liệu & Minh bạch ([DATA_SOURCES.md](DATA_SOURCES.md)):**
   - Liên kết trực tiếp tới file PDF quét gốc của Thư viện Pháp luật / Cục Đường bộ Việt Nam.

---

## 🛠️ Cài Đặt Thủ Công (Manual Setup)

Nếu không sử dụng script tự động `./setup.sh`, bạn có thể thực hiện theo các bước thủ công sau:

### 1. Tạo Bot trên Discord Developer Portal
1. Truy cập [Discord Developer Portal](https://discord.com/developers/applications).
2. Nhấn **New Application** và đặt tên cho Bot.
3. Vào mục **Bot** -> sao chép **Bot Token**.
4. Vào mục **OAuth2** -> sao chép **Client ID**.

### 2. Thiết lập Môi trường & Chạy Bot
```bash
# 1. Tạo file .env từ .env.example
cp .env.example .env

# 2. Cấu hình file .env
# DISCORD_TOKEN=Token_của_bạn
# CLIENT_ID=Client_ID_của_bạn
# LIVE_CHANNEL_ID=ID_kênh_cho_phép_bot_hoạt_động (Tùy chọn)

# 3. Cài đặt thư viện
npm install

# 4. Đăng ký các lệnh Slash Commands
npm run register

# 5. Khởi động bot
npm start
```

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
ltlx_bot/
├── data/
│   ├── questions.json     # Cơ sở dữ liệu 600 câu hỏi sát hạch B2 (JSON)
│   ├── parse_questions.py # Script xử lý OCR & trích xuất dữ liệu tự động
│   └── stats.json         # File lưu trữ tiến độ học tập của từng người dùng
├── utils/
│   └── statsManager.js    # Tiện ích quản lý đọc/ghi thống kê học tập
├── setup.sh               # Script Quick Setup tự động (macOS/Linux/Termux)
├── DATA_SOURCES.md        # Tài liệu minh bạch nguồn gốc PDF & phương pháp OCR
├── .env.example           # File cấu hình mẫu môi trường
├── index.js               # Điểm khởi chạy bot chính & xử lý tương tác
├── register-commands.js   # Script đăng ký các lệnh Slash với Discord API
└── README.md              # Tài liệu hướng dẫn sử dụng bot
```

---

## 📄 Giấy Phép & Nguồn Gốc

- Dữ liệu câu hỏi thuộc bản quyền của **Cục Đường bộ Việt Nam - Bộ Giao thông Vận tải**.
- File PDF gốc: [On-thi-gplx-hang-b2-2023.pdf](https://cdn.thuvienphapluat.vn/uploads/OnThiGiayPhepLaiXe/On-thi-gplx-hang-b2-2023.pdf).
