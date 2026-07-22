# 📚 Tài Liệu Nguồn Dữ Liệu & Quy Trình Trích Xuất (Data Source & Provenance)

Tài liệu này ghi lại toàn bộ thông tin nguồn gốc dữ liệu, quy trình trích xuất OCR, thuật toán xác định đáp án và cấu trúc lưu trữ cho bộ dữ liệu **600 câu hỏi thi lý thuyết Giấy phép lái xe (GPLX) hạng B2**.

---

## 1. Thông Tin Nguồn Gốc (Data Source Provenance)

- **Tên tài liệu gốc**: `On-thi-gplx-hang-b2-2023.pdf`
- **Đường dẫn tải nguồn**: [https://cdn.thuvienphapluat.vn/uploads/OnThiGiayPhepLaiXe/On-thi-gplx-hang-b2-2023.pdf](https://cdn.thuvienphapluat.vn/uploads/OnThiGiayPhepLaiXe/On-thi-gplx-hang-b2-2023.pdf)
- **Đơn vị biên soạn nguồn**: Thư viện Pháp luật (Dựa theo Bộ 600 câu hỏi sát hạch lý thuyết lái xe ô tô ban hành bởi Cục Đường bộ Việt Nam - Bộ Giao thông Vận tải).
- **Ngày thu thập & trích xuất**: 22/07/2026.
- **Kích thước file PDF**: 18.2 MB (111 trang bản quét chất lượng cao).
- **Vị trí lưu trữ trong dự án**: `data/b2_2023.pdf`.

---

## 2. Phương Pháp Trích Xuất Dữ Liệu (Extraction Methodology)

Do file PDF gốc chứa các trang được quét dưới dạng hình ảnh phẳng (Raster Scan PDF), việc trích xuất văn bản thông thường (`pdftotext` / PyPDF) không trả về chữ. Quy trình trích xuất tự động đã được triển khai qua các bước:

### Bước 1: OCR Nhận Diện Chữ Viết Tiếng Việt
- **Công nghệ**: Sử dụng **Apple Vision Framework** (`VNRecognizeTextRequest`) kết hợp **PDFKit** trên macOS.
- **Chế độ OCR**: Nhận diện độ chính xác cao (`recognitionLevel = .accurate`), hỗ trợ ngôn ngữ tiếng Việt (`vi-VN`) với bộ từ điển ngữ cảnh chuyên ngành giao thông.

### Bước 2: Thuật Toán Phân Tích Màu Sắc Nhận Diện Đáp Án Đúng
Trực quan trên file PDF gốc:
- Các lựa chọn sai sử dụng nút chọn rỗng (radio rỗng) và **chữ màu đen** (Black text: RGB $\approx [165, 165, 165]$ trên ảnh).
- Đáp án đúng sử dụng nút chọn xanh lá và **chữ màu xanh lục đậm/Teal** ($RGB \approx [170, 208, 190]$ trên ảnh, trong đó kênh Green cao vượt trội $G - R \ge 22$).
- Thuật toán trích xuất trích đo giá trị RGB của từng dòng chữ được nhận diện từ `VNRecognizeTextRequest`. Dòng nào có màu Xanh lục được gắn cờ `isGreen = true`, tương ứng với `answer` đúng của câu hỏi.

### Bước 3: Tách Khối & Làm Sạch Dữ Liệu (Python Parser)
- Sử dụng script `data/parse_questions.py` ghép các dòng chữ nối tiếp qua các trang PDF.
- Tách biệt 4 thành phần chính:
  1. **Tiêu đề câu hỏi**: Nhận diện tiền tố `Câu <ID>: ...`.
  2. **Danh sách các lựa chọn (`options`)**: Tách theo dấu đầu dòng (`•`, `O`, `®`, `1.`, `2.`, `Biển 1`, `Biển 2`,...).
  3. **Chỉ số đáp án đúng (`answer`)**: Xác định theo chỉ số lựa chọn chứa cờ màu xanh lục (`0-indexed`).
  4. **Lời giải thích (`explanation`)**: Nhận diện từ khóa `Giải thích đáp án: ...` ở cuối mỗi câu hỏi.

---

## 3. Cấu Trúc Bộ Dữ Liệu Chuẩn (`data/questions.json`)

Mỗi câu hỏi trong file `data/questions.json` tuân theo định dạng JSON tiêu chuẩn sau:

```json
{
  "id": 1,
  "category": "luat",
  "question": "Phần của đường bộ được sử dụng cho các phương tiện giao thông qua lại là gì?",
  "options": [
    "Phần mặt đường và lề đường.",
    "Phần đường xe chạy."
  ],
  "answer": 1,
  "explanation": "Phần đường xe chạy là phần của đường bộ được sử dụng cho phương tiện giao thông qua lại.",
  "is_critical": false
}
```

### Thống Kê Phân Loại Danh Mục (`category`)

| Mã Danh Mục (`category`) | Tên Chủ Đề | Số Câu Hỏi |
| :--- | :--- | :---: |
| `luat` | Khái niệm và quy tắc giao thông đường bộ | 166 câu (Q1 - Q166) |
| `nghiepvu` | Nghiệp vụ vận tải ô tô | 26 câu (Q167 - Q192) |
| `daoduc` | Văn hóa giao thông & Đạo đức người lái xe | 21 câu (Q193 - Q213) |
| `kthuat` | Kỹ thuật lái xe ô tô | 56 câu (Q214 - Q269) |
| `cautao` | Cấu tạo & Sửa chữa xe ô tô đơn giản | 35 câu (Q270 - Q304) |
| `bienbao` | Hệ thống biển báo hiệu đường bộ Việt Nam | 182 câu (Q305 - Q486) |
| `sahinh` | Giải các thế sa hình & Tình huống giao thông | 114 câu (Q487 - Q600) |
| **Tổng cộng** | **Bộ câu hỏi GPLX B2 hoàn chỉnh** | **600 câu** |

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
