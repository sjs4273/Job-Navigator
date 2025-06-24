# 사용자(User) 테이블의 DB 모델 정의 파일

from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import declarative_base

Base = declarative_base()


# User 테이블 정의
class User(Base):
    __tablename__ = "users"

    """
    user_id : 기본키
    social_provider : 소셜 로그인 제공자 (ex: google, naver, kakao)
    social_id : 소셜로그인 ID(소셜 플랫폼 고유 ID)
    email : 사용자 이메일
    name : 사용자 이름
    profile_image = 프로필 이미지 URL
    is_active : 계정 활성화 상태
    create_at : 생성일
    """

    user_id = Column(Integer, primary_key=True, index=True)
    social_provider = Column(String(20), nullable=False)
    social_id = Column(String(100), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    name = Column(String(100))
    profile_image = Column(String(300))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

