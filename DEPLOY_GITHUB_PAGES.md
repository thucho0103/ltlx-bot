# 🚀 Hướng Dẫn Deploy Web Tĩnh Lên GitHub Pages

Tài liệu hướng dẫn deploy ứng dụng tĩnh **Học Lý Thuyết Lái Xe B2** lên GitHub Pages. Ứng dụng chạy 100% Client-Side trên trình duyệt, không cần bất kỳ server backend nào.

---

## 🛠️ 1. Hướng Dẫn Deploy Lên GitHub Pages

### Bước 1: Biên Dịch Dự Án Tĩnh
Chạy lệnh sau tại thư mục gốc của dự án:
```bash
npm run build
```
Lệnh này sẽ tạo thư mục `frontend/dist/` chứa toàn bộ trang web tĩnh (`index.html`, `assets/`, `data/questions.json`).

### Bước 2: Deploy Tự Động Với `gh-pages`
```bash
# Cài đặt thư viện gh-pages (nếu chưa cài)
npm install -D gh-pages

# Deploy thư mục frontend/dist lên nhánh gh-pages
npx gh-pages -d frontend/dist
```

### Bước 3: Bật GitHub Pages Trong Repo Settings
1. Truy cập Repository trên GitHub (`https://github.com/username/ltlx-bot`).
2. Vào **Settings** -> **Pages**.
3. Tại phần **Source**, chọn **Deploy from a branch**.
4. Tại phần **Branch**, chọn `gh-pages` và `/ (root)`, sau đó nhấn **Save**.
5. Đợi khoảng 1-2 phút, trang web của bạn sẽ hoạt động tại địa chỉ:
   `https://username.github.io/ltlx-bot/`

---

## ⚡ 2. Deploy Tự Động Với GitHub Actions (Tùy chọn)

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy Static App to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install & Build
        run: |
          npm install
          npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```
