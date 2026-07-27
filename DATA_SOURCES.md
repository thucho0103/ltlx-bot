# 📚 Tài Liệu Nguồn Dữ Liệu & Quy Trình Trích Xuất (Data Source & Provenance)

Tài liệu này ghi lại thông tin nguồn gốc dữ liệu và cấu trúc lưu trữ cho bộ dữ liệu **600 câu hỏi thi lý thuyết Giấy phép lái xe (GPLX) hạng B2 (Cập nhật 2025)**.

---

## 1. Thông Tin Nguồn Gốc (Data Source Provenance)

- **Nguồn dữ liệu**: API trực tuyến từ [taplai.com](https://taplai.com)
- **API Endpoint**: `https://taplai.com/jshuy/600cau2025/get_question.php?number={number}`
- **Headers sử dụng**:
  - `sec-ch-ua-platform: "macOS"`
  - `Referer: https://taplai.com/hoc-ly-thuyet-600-cau-lai-xe-o-to-truc-tuyen-moi-nhat.html`
  - `User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36`
  - `Accept: application/json`
- **Ngày thu thập & cập nhật**: 27/07/2026.
- **Tổng số câu hỏi**: 600 câu hỏi sát hạch mới nhất kèm đầy đủ 318 hình ảnh minh họa (.webp) và 60 câu hỏi điểm liệt.

---

## 2. Cấu Trúc Bộ Dữ Liệu Chuẩn (`data/questions.json`)

Mỗi câu hỏi trong file `data/questions.json` tuân theo định dạng JSON tiêu chuẩn sau:

```json
{
  "id": 300,
  "category": "cautao",
  "question": "Khi động cơ đã hoạt động, bảng đồng hồ xuất hiện biểu tượng hình vẽ dưới đây, báo hiệu tình trạng như thế nào của xe?",
  "options": [
    "Báo hiệu hệ thống túi khí đã bật.",
    "Báo hiệu đèn chiếu sáng xa đã bật.",
    "Báo hiệu chế độ lái tiết kiệm nhiên liệu đã bật.",
    "Báo hiệu đèn cảnh báo khoảng cách đã bật."
  ],
  "answer": 2,
  "explanation": "Biểu tượng ECO trên bảng đồng hồ báo hiệu chế độ lái tiết kiệm nhiên liệu đã được kích hoạt...",
  "image": "https://taplai.com/img/600cau2025/300.webp",
  "is_critical": false
}
```

### Thống Kê Phân Loại Danh Mục (`category`)

| Mã Danh Mục (`category`) | Tên Chủ Đề | Số Câu Hỏi |
| :--- | :--- | :---: |
| `luat` | Khái niệm và quy tắc giao thông đường bộ | 166 câu (Q1 - Q166) |
| `nghiepvu` | Nghiệp vụ vận tải ô tô | 14 câu (Q167 - Q180) |
| `daoduc` | Văn hóa giao thông & Đạo đức người lái xe | 25 câu (Q181 - Q205) |
| `kthuat` | Kỹ thuật lái xe ô tô | 58 câu (Q206 - Q263) |
| `cautao` | Cấu tạo & Sửa chữa xe ô tô đơn giản | 37 câu (Q264 - Q300) |
| `bienbao` | Hệ thống biển báo hiệu đường bộ Việt Nam | 185 câu (Q301 - Q485) |
| `sahinh` | Giải các thế sa hình & Tình huống giao thông | 115 câu (Q487 - Q600) |
| **Tổng cộng** | **Bộ câu hỏi GPLX B2 hoàn chỉnh** | **600 câu (318 câu có hình ảnh)** |

### Câu Hỏi Điểm Liệt (`is_critical`)
- **Số lượng**: **60 câu hỏi điểm liệt**.
- Được đánh dấu `is_critical: true` cho các câu thuộc nhóm hành vi bị nghiêm cấm, quy tắc an toàn đặc biệt cấp bách, đường sắt, nồng độ cồn, ma túy, cao tốc, nhường đường khẩn cấp.

---

## 4. Hướng Dẫn Tái Tạo / Cập Nhật Dữ Liệu

Nếu cần chạy lại quá trình trích xuất hoặc cập nhật dữ liệu:

```bash
# Chạy script Python để tổng hợp và kiểm tra dữ liệu vào data/questions.json
python3 data/parse_questions.py
```
