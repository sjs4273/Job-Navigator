# 📄 backend/app/routes/auth/naver_auth.py
"""
sequenceDiagram
  participant User as 👤 사용자
  participant Front as 🖥️ Frontend (React)
  participant Naver as 🔐 Naver 인증 서버
  participant Back as ⚙️ Backend (FastAPI)

  1: User->>Front: "네이버로 로그인" 버튼 클릭
  2: Front(GET)->>Naver: 인가코드 요청 (OAuth2)
  3: Naver(GET)->>Front: 인가코드 반환 → request.code, request.state
  4: Front(POST)->>Back: /api/v1/auth/naver-login\n{code, state}
  5: Back->>Naver: access_token 요청 (client_id, client_secret, code, state 포함)
  6: Naver-->>Back: access_token 반환
  7: Back->>Naver: access_token으로 사용자 정보 요청
  8: Naver-->>Back: 사용자 정보 반환 → user_info
  9: Back->>Back: DB에서 사용자 조회 또는 신규 생성
 10: Back->>Back: create_access_token(data={"user_id": user.user_id})
 11: Back-->>Front: 사용자 정보 + access_token 반환
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import timedelta
import httpx
import logging

from app.core.database import get_db
from app.routes.auth_utils.jwt_utils import create_access_token
from app.core.config import (
    get_naver_client_id,
    get_naver_client_secret,
    get_naver_redirect_uri,
    get_access_token_expiry_minutes,
)
from app.services.user_service import get_or_create_user

router = APIRouter()

# 🔐 환경 변수 로딩
NAVER_CLIENT_ID = get_naver_client_id()
NAVER_CLIENT_SECRET = get_naver_client_secret()
NAVER_REDIRECT_URI = get_naver_redirect_uri()
ACCESS_TOKEN_EXPIRE_MINUTES = get_access_token_expiry_minutes()

# 📋 로깅 설정
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class NaverLoginRequest(BaseModel):
    code: str
    state: str


async def get_naver_user_info(code: str, state: str) -> dict:
    """
    5~8단계: 네이버 인가코드를 통해 사용자 정보를 조회하여 딕셔너리로 반환합니다.
    """
    token_url = "https://nid.naver.com/oauth2.0/token"
    token_params = {
        "grant_type": "authorization_code",
        "client_id": NAVER_CLIENT_ID,
        "client_secret": NAVER_CLIENT_SECRET,
        "code": code,
        "state": state,
        "redirect_uri": NAVER_REDIRECT_URI,
    }

    logger.info(f"📡 [DEBUG] 토큰 요청 파라미터: {token_params}")

    async with httpx.AsyncClient() as client:
        token_res = await client.post(token_url, params=token_params)

        logger.info(f"🧾 [DEBUG] token_res.status_code = {token_res.status_code}")
        logger.info(f"🧾 [DEBUG] token_res.text = {token_res.text}")

        if token_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get Naver token")

        try:
            token_json = await token_res.json()
        except Exception as e:
            logger.error(f"❌ JSON 디코딩 실패: {e}")
            logger.error(f"🧾 응답 원문: {token_res.text}")
            raise HTTPException(status_code=500, detail="Naver token 응답 파싱 실패")

        access_token = token_json.get("access_token")
        if not access_token:
            logger.error("❌ access_token 없음. 응답 내용:", token_json)
            raise HTTPException(status_code=400, detail="access_token 없음")

        logger.info("✅ [6] access_token 발급 성공")

        profile_res = await client.get(
            "https://openapi.naver.com/v1/nid/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )

        logger.info(f"🧾 [DEBUG] profile_res.status_code = {profile_res.status_code}")
        logger.info(f"🧾 [DEBUG] profile_res.text = {profile_res.text}")

        if profile_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get Naver user info")

        try:
            profile_json = await profile_res.json()
        except Exception as e:
            logger.error(f"❌ 사용자 정보 JSON 파싱 실패: {e}")
            raise HTTPException(status_code=500, detail="사용자 정보 파싱 실패")

        profile = profile_json.get("response", {})
        naver_id = str(profile.get("id"))
        email = profile.get("email", f"{naver_id}@naver.com")
        name = profile.get("name", "Naver User")
        profile_image = profile.get("profile_image", "")

        logger.info(f"✅ [8] 사용자 정보 조회 완료: {email}")

        return {
            "social_id": naver_id,
            "email": email,
            "name": name,
            "profile_image": profile_image,
        }


@router.post("/naver-login")
async def naver_login(request: NaverLoginRequest, db: Session = Depends(get_db)):
    """
    4~11단계: 네이버 인가코드(code)와 상태값(state)을 받아 정보를 가져오고
    로그인 및 회원가입 처리 후 JWT 토큰을 반환합니다.
    """
    logger.info("🚀 [4] 네이버 로그인 요청 수신")

    user_info = await get_naver_user_info(request.code, request.state)

    user = get_or_create_user(db, user_info=user_info, social_provider="naver")

    token = create_access_token(
        data={"user_id": user.user_id},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    logger.info(f"🎫 JWT 발급 완료 - user_id: {user.user_id}")

    return {
        "user_id": user.user_id,
        "social_provider": user.social_provider,
        "social_id": user.social_id,
        "email": user.email,
        "name": user.name,
        "profile_image": user.profile_image,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "access_token": token,
    }
