#backend/ai/extractor.py
import fitz  # PyMuPDF
import re
from typing import List

# ✅ PDF 파일에서 텍스트 추출 (세로 텍스트 보정 및 정제 포함)
def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    PDF 바이너리에서 텍스트를 추출하고, 세로 텍스트 및 공백 보정을 수행합니다.
    """
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    all_text_parts = []

    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)
        basic_text = page.get_text()
        vertical_fixed_text = detect_and_fix_vertical_text(page)
        combined_text = combine_texts(basic_text, vertical_fixed_text)
        all_text_parts.append(combined_text)

    doc.close()
    full_text = "\n\n".join(all_text_parts)
    return clean_extracted_text(full_text)

# ✅ 세로 텍스트 인식 및 정제
def detect_and_fix_vertical_text(page) -> str:
    text_dict = page.get_text("dict")
    vertical_fixes = []
    for block in text_dict["blocks"]:
        if "lines" in block:
            for line in block["lines"]:
                line_text = ""
                line_bbox = line["bbox"]
                for span in line["spans"]:
                    line_text += span["text"]

                if line_text.strip():
                    width = line_bbox[2] - line_bbox[0]
                    height = line_bbox[3] - line_bbox[1]

                    is_vertical = (
                        height > width * 1.5 or
                        re.match(r'^[\w가-힣](\s+[\w가-힣])+$', line_text.strip())
                    )

                    if is_vertical:
                        fixed_text = fix_vertical_text(line_text.strip())
                        if fixed_text != line_text.strip():
                            vertical_fixes.append(fixed_text)
    return '\n'.join(vertical_fixes)

def fix_vertical_text(text: str) -> str:
    if re.match(r'^[\w가-힣](\s+[\w가-힣])+$', text):
        return re.sub(r'\s+', '', text)
    return text

def combine_texts(basic_text: str, vertical_text: str) -> str:
    if not vertical_text.strip():
        return basic_text
    combined = basic_text
    for fix in vertical_text.split('\n'):
        if fix.strip() and fix.strip() not in basic_text:
            combined += '\n' + fix.strip()
    return combined

def clean_extracted_text(text: str) -> str:
    print("🧹 텍스트 정제 중...")
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)

    tech_patterns = [
        (r'\bJava\s+Script\b', 'JavaScript'),
        (r'\bType\s+Script\b', 'TypeScript'),
        (r'\bNode\s*\.\s*js\b', 'Node.js'),
        (r'\bNext\s*\.\s*js\b', 'Next.js'),
        (r'\bVue\s*\.\s*js\b', 'Vue.js'),
        (r'\bReact\s+Native\b', 'React Native'),
        (r'\bSpring\s+Boot\b', 'Spring Boot'),
        (r'\bMy\s*SQL\b', 'MySQL'),
        (r'\bPost\s*greSQL\b', 'PostgreSQL'),
        (r'\bMongo\s*DB\b', 'MongoDB'),
    ]
    for pattern, replacement in tech_patterns:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)

    lines = [line.strip() for line in text.split('\n') if line.strip()]
    return '\n'.join(lines)


# ✅ 기술 키워드 사전
TECH_KEYWORDS = {
    "languages": [
        "Python", "Java", "C", "C++", "C#", "JavaScript", "TypeScript", "Go", "Kotlin", "Swift", "Rust", "PHP", "Ruby",
        "Scala", "Perl", "Dart", "Shell", "Bash", "R", "Elixir", "Haskell"
    ],
    "frameworks": [
        "Spring Boot", "Spring", "Django", "FastAPI", "Flask", "Express", "NestJS", "Next.js", "Nuxt.js", "Angular",
        "Vue", "React", "Svelte", "ASP.NET", "Laravel", "Rails", "Meteor", "Gin"
    ],
    "tools": [
        "Git", "GitHub", "GitLab", "Jupyter", "Eclipse", "IntelliJ", "Visual Studio Code", "VS Code", "PyCharm",
        "Firebase", "Docker", "Kubernetes", "Nginx", "Apache", "Postman", "Swagger", "Jenkins", "CircleCI",
        "Airflow", "Terraform", "Ansible", "Vagrant"
    ],
    "databases": [
        "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "MariaDB", "DynamoDB", "Elasticsearch", "Oracle",
        "Cassandra", "InfluxDB", "Firebase Realtime Database", "Supabase"
    ],
    "cloud": [
        "AWS", "Azure", "GCP", "Google Cloud", "Firebase", "Heroku", "Netlify", "Vercel", "Cloudflare", "DigitalOcean"
    ],
    "ml_dl": [
        "YOLOv5", "YOLOv7", "YOLO-NAS", "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "OpenCV", "XGBoost",
        "LightGBM", "CatBoost", "Pandas", "NumPy", "HuggingFace", "Transformers", "spaCy", "NLTK"
    ],
    "devops": [
        "CI/CD", "GitOps", "Docker Compose", "Prometheus", "Grafana", "Sentry", "Logstash", "Filebeat", "Kibana"
    ],
    "testing": [
        "Jest", "Mocha", "Chai", "Cypress", "JUnit", "Selenium", "Pytest", "Unittest", "TestNG"
    ],
    "others": [
        "REST API", "GraphQL", "gRPC", "WebSocket", "JWT", "OAuth", "WebRTC", "Redux", "Zustand", "Recoil", "Three.js"
    ]
}

# ✅ 복합 키워드 표준화 맵
KEYWORD_SYNONYMS = {
    "vs code": "Visual Studio Code",
    "google cloud": "GCP",
    "ci/cd": "CI/CD",
}

# ✅ 텍스트에서 키워드 추출
def extract_keywords_from_text(text: str) -> List[str]:
    """
    전체 텍스트에서 사전 정의된 기술 키워드를 추출합니다.

    Parameters:
        text (str): 이력서에서 추출된 전체 텍스트

    Returns:
        List[str]: 중복 제거된 키워드 리스트
    """
    found_keywords = set()
    lowered_text = text.lower()

    for category_keywords in TECH_KEYWORDS.values():
        for keyword in category_keywords:
            if re.search(r'\b' + re.escape(keyword.lower()) + r'\b', lowered_text):
                found_keywords.add(keyword)

    for alias, standard in KEYWORD_SYNONYMS.items():
        if re.search(r'\b' + re.escape(alias) + r'\b', lowered_text):
            found_keywords.add(standard)

    return sorted(found_keywords)