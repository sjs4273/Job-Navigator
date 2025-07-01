# 📄 app/routes/jobanalysis.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

# ✅ 요청 데이터 모델
class RoadmapRequest(BaseModel):
    job: str
    skills: List[str]

# ✅ Section 모델 (각 항목에 title과 content 포함)
class Section(BaseModel):
    title: str
    content: str

# ✅ 응답 데이터 모델 (gap_score 등 삭제 버전)
class RoadmapResponse(BaseModel):
    trend_analysis: Section
    pros_cons: Section
    learning_order: Section
    substitution_risk: Section
    stack_expansion: Section
    market_demand: Section

# ✅ 분석 API 엔드포인트
@router.post("/roadmap", response_model=RoadmapResponse)
async def generate_roadmap(data: RoadmapRequest):
    print(f"📩 직무: {data.job}, 기술: {data.skills}")

    return RoadmapResponse(
        trend_analysis=Section(
            title="기술 트렌드 분석",
            content="Python은 AI/ML과 데이터 엔지니어링 분야에서 강세이며, 앞으로도 수요 증가가 예상됩니다."
        ),
        pros_cons=Section(
            title="선택한 기술의 장단점",
            content="Spring Boot는 빠른 개발과 마이크로서비스 설계에 유리하지만, 초기 설정과 메모리 사용량이 비교적 높습니다."
        ),
        learning_order=Section(
            title="선택한 기술들의 추천 학습 순서",
            content="먼저 TypeScript를 학습한 뒤, React와 Next.js를 연계 학습하는 것을 권장합니다."
        ),
        substitution_risk=Section(
            title="선택 기술의 대체 가능성 (Risk)",
            content="Node.js는 일부 환경에서 Go로 대체되는 추세이며, Rust 채택도 증가하고 있습니다."
        ),
        stack_expansion=Section(
            title="관련 기술 스택 확장 제안",
            content="Backend 개발자는 Docker, Kubernetes, CI/CD 도구도 함께 학습하면 경쟁력이 높습니다."
        ),
        market_demand=Section(
            title="구체적 직무별 시장 수요",
            content="백엔드 개발자는 Java + Spring Boot 조합이 가장 많으며, Python + Django도 꾸준히 인기 있습니다."
        )
    )
