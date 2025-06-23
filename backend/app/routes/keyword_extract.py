# backend/app/routes/keyword_extract.py

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.routes.auth_utils.jwt_utils import get_current_user
from app.services.keyword_service import extract_and_save_keywords
import logging

router = APIRouter()

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

@router.post("")
async def extract_keywords_from_pdf(
    pdf_file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    업로드된 PDF 파일을 받아 키워드를 추출하고,
    결과를 JSON 형태로 반환하는 API 엔드포인트입니다.
    """
    logger.info(f"📥 파일 업로드 요청 - 사용자 ID: {current_user['user_id']}, 파일명: {pdf_file.filename}")

    if pdf_file.content_type != "application/pdf":
        logger.warning("❌ 잘못된 파일 형식 업로드 시도")
        raise HTTPException(status_code=400, detail="PDF 파일만 업로드 가능합니다.")

    result = await extract_and_save_keywords(current_user, pdf_file)

    logger.info(f"✅ 키워드 추출 완료 - 파일명: {pdf_file.filename}, 키워드 수: {len(result['keywords'])}")
    return result
