import os
import requests
from datetime import datetime
from pytrends.request import TrendReq
from dotenv import load_dotenv
import pandas as pd
from dateutil.relativedelta import relativedelta

# ✅ 환경변수 불러오기 (.env에서 GITHUB_TOKEN 사용)
load_dotenv()
GITHUB_HEADERS = {
    "Authorization": f"Bearer {os.getenv('GITHUB_TOKEN')}"
}

# ✅ 직무별 수집 키워드 설정
ROLE_TECH_KEYWORDS = {
    "backend": {
        "languages": ["Python", "Java", "Go", "TypeScript"],
        "libraries": ["express", "nestjs", "fastify"],
        "trends": ["Python", "Java", "Go", "FastAPI", "Django"]
    },
    "frontend": {
        "languages": ["JavaScript", "TypeScript"],
        "libraries": ["react", "vue", "angular", "next.js", "svelte"],
        "trends": ["React", "Vue", "Svelte", "JavaScript", "Next.js"]
    },
    "mobile": {
        "languages": ["Kotlin", "Swift", "Java"],
        "libraries": ["flutter", "react-native", "jetpack-compose"],
        "trends": ["Flutter", "Swift", "Kotlin"]
    },
    "ai": {
        "languages": ["Python"],
        "libraries": ["tensorflow", "pytorch", "scikit-learn"],
        "trends": ["TensorFlow", "PyTorch", "Machine Learning", "Python"]
    }
}

# ✅ GitHub 리포지토리 수 조회
def fetch_github_repo_count(language: str) -> int:
    url = f"https://api.github.com/search/repositories?q=language:{language}&per_page=1"
    res = requests.get(url, headers=GITHUB_HEADERS)
    if res.status_code == 200:
        return res.json().get("total_count", 0)
    return 0

# ✅ 월별 GitHub 리포지토리 생성량 조회
def fetch_monthly_repo_growth(language: str, month_ranges: list[tuple[str, str]]) -> list[dict]:
    result = []
    for start_date, end_date in month_ranges:
        url = f"https://api.github.com/search/repositories?q=language:{language}+created:{start_date}..{end_date}&per_page=1"
        res = requests.get(url, headers=GITHUB_HEADERS)
        count = res.json().get("total_count", 0) if res.status_code == 200 else 0
        result.append({
            "month": start_date[:7],
            language: count
        })
    return result

# ✅ 최근 N개월 범위 생성
def get_last_n_months(n: int = 6):
    today = datetime.today().replace(day=1)
    return [
        (
            (today - relativedelta(months=i)).strftime('%Y-%m-01'),
            (today - relativedelta(months=i - 1)).strftime('%Y-%m-01')
        )
        for i in reversed(range(n))
    ]

# ✅ Google Trends 수집
def fetch_google_trends(keywords: list[str]) -> list[dict]:
    pytrends = TrendReq(hl="en-US", tz=360)
    pytrends.build_payload(keywords, timeframe='today 3-m')
    df = pytrends.interest_over_time()
    df = df.reset_index().rename(columns={"date": "week"})
    df["week"] = df["week"].astype(str).str[:10]
    return df.to_dict(orient="records")

# ✅ StackOverflow 설문 분석
def fetch_stackoverflow_survey(tech_keywords: list[str]) -> list[dict]:
    file_path = "data/survey_results_public.csv"
    if not os.path.exists(file_path):
        print(f"❗ StackOverflow 설문 파일이 없습니다: {file_path}")
        return []

    df = pd.read_csv(file_path, low_memory=False)

    results = []
    for tech in tech_keywords:
        usage = df["LanguageHaveWorkedWith"].fillna("").str.contains(tech, case=False).sum()
        loved = df["LanguageWantToWorkWith"].fillna("").str.contains(tech, case=False).sum()
        admired = df["LanguageAdmired"].fillna("").str.contains(tech, case=False).sum()

        results.append({
            "technology": tech,
            "usage": round(usage / len(df) * 100, 2),
            "loved": round(loved / len(df) * 100, 2),
            "wanted": round(admired / len(df) * 100, 2),
        })
    return results

# ✅ NPM 다운로드 수 조회
def fetch_npm_downloads(package_name: str) -> int:
    url = f"https://api.npmjs.org/downloads/point/last-month/{package_name}"
    res = requests.get(url)
    if res.status_code == 200:
        return res.json().get("downloads", 0)
    return 0

# ✅ 정규화 함수
def normalize(value, min_val, max_val):
    if max_val - min_val == 0:
        return 0
    return round((value - min_val) / (max_val - min_val) * 100, 1)

# ✅ 기술 종합 점수 생성
def generate_radar_scores(github_data, google_trend_data, stack_data):
    radar = []

    # Google Trends 평균 계산
    trend_avg = {}
    for row in google_trend_data:
        for key in row:
            if key not in {"week", "isPartial"}:
                trend_avg.setdefault(key, []).append(row[key])
    trend_avg = {k: sum(v)/len(v) for k, v in trend_avg.items()}

    # StackOverflow dict
    stack_dict = {s["technology"].lower(): s for s in stack_data}

    for item in github_data:
        name = item["name"].lower()

        radar.append({
            "technology": item["name"],
            "github": normalize(item["repositories"], 0, 5000000),
            "trends": normalize(trend_avg.get(item["name"], 0), 0, 100),
            "stackoverflow": normalize(stack_dict.get(name, {}).get("usage", 0), 0, 70),
            "popularity": normalize(item["repositories"], 0, 5000000)
        })

    return radar

# ✅ 메인 수집 함수
def collect_trend_by_role(role: str) -> dict:
    config = ROLE_TECH_KEYWORDS.get(role)
    if not config:
        raise ValueError(f"지원하지 않는 직무 유형: {role}")

    # GitHub 언어 리포 수
    github_data = []
    for lang in config["languages"]:
        count = fetch_github_repo_count(lang)
        github_data.append({"name": lang, "repositories": count, "value": 0, "color": "#000000"})

    total_repos = sum(d["repositories"] for d in github_data)
    for d in github_data:
        d["value"] = round((d["repositories"] / total_repos) * 100, 1) if total_repos else 0

    # Repo Growth
    month_ranges = get_last_n_months(6)
    repo_growth = []
    for lang in config["languages"]:
        monthly_data = fetch_monthly_repo_growth(lang, month_ranges)
        for i, data in enumerate(monthly_data):
            if i >= len(repo_growth):
                repo_growth.append({"month": data["month"]})
            repo_growth[i][lang] = data[lang]

    # NPM 다운로드 수
    libraries = []
    for lib in config["libraries"]:
        downloads = fetch_npm_downloads(lib.lower())
        libraries.append({
            "name": lib,
            "downloads": downloads,
            "stars": 0,
            "forks": 0,
            "trend": 0
        })

    # Google Trends
    google_trend = fetch_google_trends(config["trends"])

    # StackOverflow
    all_keywords = list(set(config["languages"] + config["libraries"]))
    stackoverflow = fetch_stackoverflow_survey(all_keywords)

    # Radar Score
    radar_score = generate_radar_scores(github_data, google_trend, stackoverflow)

    return {
        "role": role,
        "overview": {
            "github_repos": total_repos,
            "search_volume": 0,
            "active_developers": 0,
            "library_stars": 0
        },
        "github_language_distribution": github_data,
        "repo_growth": repo_growth,
        "popular_libraries": libraries,
        "google_trends": google_trend,
        "stackoverflow_survey": stackoverflow,
        "radar_score": radar_score,
        "generated_at": datetime.now().isoformat()
    }
