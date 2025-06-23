from sqlalchemy.orm import Session
from app.models.user import User, UserUpdate
from typing import Optional

# 사용자 조회 함수
def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.user_id == user_id).first()

# 사용자 수정 함수
def update_user(db: Session, user_id: int, user_update: UserUpdate):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        return None
    
    # 이메일 중복 체크
    if user_update.email and user_update.email != user.email:
        email_exists = db.query(User).filter(User.email == user_update.email).first()
        if email_exists:
            raise ValueError("이미 사용 중인 이메일입니다.")
        
    # 변경할 필드 적용
    for key, value in user_update.dict(exclude_unset=True).items():
        if hasattr(value, "__str__"):
            value = str(value)
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user

# ✅ 소셜 로그인 전용: 사용자 없으면 생성하고 반환
def get_or_create_user(
    db: Session,
    user_info: dict,
    social_provider: str,
) -> User:
    """
    소셜 로그인 사용자 조회 또는 신규 생성 후 반환

    Parameters:
        db (Session): DB 세션
        user_info (dict): 사용자 정보 (social_id, email, name, profile_image)
        social_provider (str): 소셜 제공자 (google, kakao, naver)

    Returns:
        User: DB 사용자 객체
    """
    user = db.query(User).filter(
        User.social_id == user_info["social_id"],
        User.social_provider == social_provider,
    ).first()

    if not user:
        user = User(
            social_provider=social_provider,
            social_id=user_info["social_id"],
            email=user_info["email"],
            name=user_info.get("name"),
            profile_image=user_info.get("profile_image"),
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user