# 📄 services/gpt_payload_builder.py

import json
import httpx
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.resume import ResumeORM


def get_resume_data(db: Session, resume_id: int) -> ResumeORM:
    resume = db.query(ResumeORM).filter(ResumeORM.resume_id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="해당 이력서를 찾을 수 없습니다.")
    return resume


async def fetch_tech_trend(role: str) -> dict:
    url = f"http://localhost:8000/api/v1/trends/roles/{role}"
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(url)
            res.raise_for_status()
            return res.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"tech_trend API 호출 실패: {e}")


async def fetch_market_trend(role: str) -> dict:
    url = f"http://localhost:8000/api/v1/trends/market/{role}"
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(url)
            res.raise_for_status()
            full_data = res.json()
            return {
                "role": full_data.get("role"),
                "updated_at": full_data.get("updated_at"),
                "data": {
                    "role": full_data["data"].get("role"),
                    "overview": full_data["data"].get("overview"),
                    "radar_score": full_data["data"].get("radar_score"),
                    "repo_growth": full_data["data"].get("repo_growth"),
                    "generated_at": full_data["data"].get("generated_at"),
                    "popular_libraries": full_data["data"].get("popular_libraries"),
                    "stackoverflow_survey": full_data["data"].get("stackoverflow_survey"),
                    "github_language_distribution": full_data["data"].get("github_language_distribution")
                }
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"market_trends API 호출 실패: {e}")


async def build_gpt_messages(db: Session, resume_id: int) -> list:
    resume = get_resume_data(db, resume_id)
    job_category = resume.job_category or "backend"

    tech_trend = await fetch_tech_trend(job_category)
    market_trends = await fetch_market_trend(job_category)

    # ✅ 사용자 요청 포맷 포함된 메시지 구성
    messages = [
        {
            "role": "system",
            "content": "너는 사용자의 이력서를 분석해서 커리어 인사이트를 제공하는 전문 분석 AI야. 분석 결과는 반드시 JSON 형식으로 작성해야 해."
        },
        {
            "role": "user",
            "content": f"""
다음 정보를 바탕으로 사용자의 역량을 분석해줘.  
아래와 **완전히 동일한 JSON 구조**로만 응답해야 하며, 모든 키를 포함해서 채워줘.  
**형식 오류 없이 올바른 JSON**으로 작성할 것.

📌 반드시 포함해야 할 조건들:
- `difficultyData`: field는 아래 4개만 포함 → `Backend`, `Frontend`, `Mobile`, `AI`
- `strengths`와 `weaknesses`: 각각 최소 3개 이상
- `learningRoadmap`은 정확히 4단계
- `recommendedResources`는 `learningRoadmap` 각 단계와 일치 (총 4개)

# ✅ 응답 JSON 형식 예시
{{
  "userProfile": {{
    "name": "최재웅",
    "experience": "신입",
    "currentField": "Backend",
    "targetField": "Backend Developer",
    "education": "조선대학교 정보통신공학부 정보보안전공",
    "training": "스마트인재개발원 언어지능기반 분석서비스 개발자과정",
    "overallGrade": "B+",
    "gradeDescription": "신입 기준 우수"
  }},
  "skillGapData": {{
    "matchingRate": 68,
    "marketComparison": "신입 기준 평균 대비 +15%",
    "userSkills": ["Java", "Python", "SQL", "Spring Boot", "Git"],
    "marketDemandSkills": ["Java", "Spring Boot", "MySQL", "Docker", "AWS", "Redis", "JPA", "RESTful API", "Git", "Linux"],
    "missingSkills": [
      {{
        "skill": "Docker",
        "priority": "높음",
        "demandRate": 78,
        "reason": "컨테이너화 필수 기술"
      }},
      {{
        "skill": "AWS",
        "priority": "중간",
        "demandRate": 65,
        "reason": "클라우드 운영 능력 요구 증가"
      }}
    ]
  }},
  "strengthsAndWeaknesses": {{
    "strengths": [
      {{
        "title": "실전 경험",
        "desc": "백엔드 실습과 프로젝트 경험을 통해 실전 감각을 갖춤"
      }},
      {{
        "title": "문제 해결력",
        "desc": "데이터 수집과 크롤링 과정에서의 문제를 자율적으로 해결함"
      }},
      {{
        "title": "기술 다양성",
        "desc": "Python, Java 등 다양한 언어와 프레임워크를 접함"
      }}
    ],
    "weaknesses": [
      {{
        "title": "인프라 경험 부족",
        "desc": "Docker, AWS 등 실무 도구 경험이 제한적임"
      }},
      {{
        "title": "협업 도구 익숙치 않음",
        "desc": "Jira, Slack 등 팀 협업 기반 도구 경험 미흡"
      }},
      {{
        "title": "테스트 경험 부족",
        "desc": "단위/통합 테스트 등 품질 보증 경험 미흡"
      }}
    ]
  }},
  "positionFitData": [
    {{
      "position": "Junior Backend Developer",
      "compatibility": 85,
      "openings": 89
    }},
    {{
      "position": "Spring Boot Developer",
      "compatibility": 80,
      "openings": 124
    }},
    {{
      "position": "API Developer",
      "compatibility": 72,
      "openings": 66
    }}
  ],
  "difficultyData": [
    {{
      "field": "Backend",
      "score": 4,
      "description": "현재 강점 분야",
      "color": "green"
    }},
    {{
      "field": "Frontend",
      "score": 7,
      "description": "HTML/CSS 기초 경험 보유",
      "color": "yellow"
    }},
    {{
      "field": "Mobile",
      "score": 8,
      "description": "Android Studio 간단한 실습 경험",
      "color": "orange"
    }},
    {{
      "field": "AI",
      "score": 9,
      "description": "AI 모델 연동 경험은 있으나 기초 역량은 부족",
      "color": "red"
    }}
  ],
  "radarData": [
    {{
      "skill": "Backend",
      "current": 7,
      "required": 8,
      "userStrong": true
    }},
    {{
      "skill": "DevOps",
      "current": 3,
      "required": 6,
      "userStrong": false
    }},
    {{
      "skill": "AI/ML",
      "current": 5,
      "required": 7,
      "userStrong": false
    }}
  ],
  "learningRoadmap": [
    {{
      "phase": "1단계 (1-2개월)",
      "skills": ["Docker", "Linux", "JPA/Hibernate"],
      "difficulty": "중간",
      "description": "백엔드 핵심 기술 보강",
      "priority": "높음"
    }},
    {{
      "phase": "2단계 (2-3개월)",
      "skills": ["AWS", "Redis", "Spring Security"],
      "difficulty": "중간",
      "description": "클라우드 및 보안 기술 실습",
      "priority": "중간"
    }},
    {{
      "phase": "3단계 (3-4개월)",
      "skills": ["CI/CD", "Kubernetes", "모니터링 도구"],
      "difficulty": "높음",
      "description": "운영 자동화 및 인프라 확장",
      "priority": "중간"
    }},
    {{
      "phase": "4단계 (5-6개월)",
      "skills": ["MSA", "Kafka", "성능 최적화"],
      "difficulty": "높음",
      "description": "대규모 서비스 아키텍처 이해",
      "priority": "중간"
    }}
  ],
  "recommendedResources": [
    {{
      "phase": "1단계",
      "title": "인프라 기초",
      "description": "Docker와 Linux 기본기 다지기",
      "resources": [
        "Docker 공식 문서",
        "생활코딩 Linux 강의",
        "스프링 부트와 JPA 실무 완전 정복"
      ]
    }},
    {{
      "phase": "2단계",
      "title": "클라우드 & 보안",
      "description": "AWS 및 인증 처리 기초 학습",
      "resources": [
        "AWS 클라우드 입문",
        "Spring Security 가이드",
        "Redis in Action"
      ]
    }},
    {{
      "phase": "3단계",
      "title": "DevOps 자동화",
      "description": "CI/CD와 쿠버네티스 운영 기술 학습",
      "resources": [
        "Jenkins 실전 가이드",
        "Kubernetes 공식 튜토리얼",
        "Prometheus & Grafana 입문"
      ]
    }},
    {{
      "phase": "4단계",
      "title": "고급 아키텍처",
      "description": "MSA와 고성능 백엔드 설계",
      "resources": [
        "마이크로서비스 아키텍처 패턴",
        "Kafka 실무 활용 가이드",
        "시스템 설계 면접 완전정복"
      ]
    }}
  ],
  "keyInsights": {{
    "strength": "Spring Boot 실무 경험과 AI 모델 연동 역량",
    "recommendedPosition": "Junior Backend Developer (적합도 85%)",
    "priorityLearning": "Docker, AWS 클라우드 인프라 기술"
  }},
  "radarInsights": {{
    "currentStrengths": "Backend, Database 분야에서 강점",
    "improvementAreas": "DevOps, AI/ML, Testing 영역 보완 필요"
  }}
}}

📄 이력서 전문:
{resume.resume_text}

🧠 추출된 기술 키워드:
{json.dumps(resume.extracted_keywords, ensure_ascii=False)}

📊 채용공고 기반 기술 트렌드 (tech_trend):
{json.dumps(tech_trend, ensure_ascii=False)}

🌐 외부 시장 기술 트렌드 (market_trends):
{json.dumps(market_trends, ensure_ascii=False)}
"""
        }
    ]
    return messages
