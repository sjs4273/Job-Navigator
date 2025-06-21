from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import declarative_base

# SQLAlchemy Base 클래스 선언 (모든 ORM 모델의 기반이 됨)
Base = declarative_base()


# ✅ 잡 공고 정보를 저장하는 SQLAlchemy ORM 모델
class JobORM(Base):
    __tablename__ = "jumpit_jobs"  # 테이블 이름 설정

    # 기본 키 (자동 증가 ID)
    id = Column(Integer, primary_key=True, index=True)

    # 공고 제목
    title = Column(String)

    # 회사명
    company = Column(String)

    # 근무 지역
    location = Column(String)

    # 기술 스택 (쉼표로 구분된 문자열)
    tech_stack = Column(Text)

    # 상세 공고 URL
    url = Column(String)

    # 마감일 (예: "채용 시 마감" 같은 텍스트)
    due_date_text = Column(String)

    # 정규직/계약직/인턴 등 고용 형태
    job_type = Column(String)
