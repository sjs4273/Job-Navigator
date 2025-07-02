# backend/app/services/job_classifier.py

"""
🔍 추출된 키워드 기반으로 직무 카테고리를 분류합니다.
"""

from typing import List

# ✅ 직무별 대표 키워드 사전
CATEGORY_RULES = {
    "backend": {"Spring", "Spring Boot", "Django", "FastAPI", "Node.js", "Java", "Python", "MySQL", "PostgreSQL"},
    "frontend": {"React", "Vue", "HTML", "CSS", "JavaScript", "TypeScript", "Next.js"},
    "mobile": {"Android", "Kotlin", "Swift", "Flutter", "iOS"},
    "ai": {"TensorFlow", "PyTorch", "NLP", "머신러닝", "딥러닝", "Pandas", "Scikit-learn"},
    "other": {"Figma", "Unity", "Photoshop", "Adobe", "블록체인", "AWS"}
}

# ✅ 규칙 기반 분류 함수
def classify_job_category(keywords: List[str]) -> str:
    scores = {category: 0 for category in CATEGORY_RULES}
    for keyword in keywords:
        for category, keywords_set in CATEGORY_RULES.items():
            if keyword in keywords_set:
                scores[category] += 1
    best_category = max(scores, key=scores.get)
    return best_category if scores[best_category] > 0 else "기타(Other)"
