import urllib.request
import json
import ssl
from concurrent.futures import ThreadPoolExecutor

# SSL setup for macOS urllib environment
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'sec-ch-ua-platform': '"macOS"',
    'Referer': 'https://taplai.com/hoc-ly-thuyet-600-cau-lai-xe-o-to-truc-tuyen-moi-nhat.html',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'sec-ch-ua': '"Not;A=Brand";v="8", "Chromium";v="150", "Google Chrome";v="150"',
    'sec-ch-ua-mobile': '?0'
}

def fetch_question(num):
    url = f'https://taplai.com/jshuy/600cau2025/get_question.php?number={num}'
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        return num, data

def map_category(num, api_cat):
    """
    Map question number & API category to internal category keys:
    'luat', 'nghiepvu', 'daoduc', 'kthuat', 'cautao', 'bienbao', 'sahinh'
    """
    if 1 <= num <= 166:
        return 'luat'
    elif 167 <= num <= 180:
        return 'nghiepvu'
    elif 'van-hoa' in api_cat or 181 <= num <= 205:
        return 'daoduc'
    elif 'ky-thuat' in api_cat or 206 <= num <= 263:
        return 'kthuat'
    elif 'cau-tao' in api_cat or 264 <= num <= 300:
        return 'cautao'
    elif 'bien-bao' in api_cat or 301 <= num <= 485:
        return 'bienbao'
    else:
        return 'sahinh'

def main():
    print("🚀 Đang tải 600 câu hỏi từ API taplai.com (2025)...")
    with ThreadPoolExecutor(max_workers=20) as executor:
        raw_results = list(executor.map(fetch_question, range(1, 601)))

    raw_results.sort(key=lambda x: x[0])
    
    questions = []
    critical_count = 0
    image_count = 0

    for num, data in raw_results:
        api_cat = data.get('category', '')
        is_critical = 'diem-liet' in api_cat or 'diemliet' in api_cat
        if is_critical:
            critical_count += 1
        
        category = map_category(num, api_cat)
        
        # Options and correct answer index
        answers = data.get('answers', [])
        options = [ans.get('text', '').strip() for ans in answers]
        correct_index = 0
        for i, ans in enumerate(answers):
            if ans.get('correct') is True:
                correct_index = i
                break
        
        # Image URL handling
        img_path = data.get('hinhanhq')
        image_url = None
        if img_path:
            image_count += 1
            if img_path.startswith('http'):
                image_url = img_path
            else:
                image_url = f"https://taplai.com{img_path}"
        
        q_obj = {
            "id": num,
            "category": category,
            "question": data.get('question', '').strip(),
            "options": options,
            "answer": correct_index,
            "explanation": data.get('explanation', '').strip(),
            "image": image_url,
            "is_critical": is_critical
        }
        questions.append(q_obj)

    # Save to data/questions.json
    output_path = '/Users/thucduy/Public/dev/ltlx_bot/data/questions.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

    print(f"✅ Đã cập nhật thành công {len(questions)} câu hỏi vào {output_path}")
    print(f"📊 Thống kê:")
    print(f"   - Số câu có hình ảnh: {image_count}/600")
    print(f"   - Số câu điểm liệt: {critical_count}/600")

if __name__ == '__main__':
    main()
