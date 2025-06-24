# backend/app/services/keyword_service.py

import uuid
import shutil
import os
import logging
from fastapi import UploadFile
from ai.extractor import extract_keywords_from_pdf  # AI 키워드 추출 함수
from app.core.database import SessionLocal
from app.models.keyword import Keyword

logger = logging.getLogger(__name__)

async def extract_and_save_keywords(current_user: dict, pdf_file: UploadFile) -> dict:
    """
    PDF 파일을 저장한 후 키워드를 추출하고, 관련 정보를 DB에 저장합니다.
    
    Parameters:
        current_user (dict): 인증된 사용자 정보
        pdf_file (UploadFile): 업로드된 PDF 파일 객체

    Returns:
        dict: 추출된 키워드 및 파일 식별 정보를 담은 응답
    """
    # 1. 임시 파일로 저장
    file_id = str(uuid.uuid4())
    filename = pdf_file.filename
    temp_dir = "./temp"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, f"{file_id}_{filename}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(pdf_file.file, buffer)

    logger.info(f"📄 PDF 저장 완료: {file_path}")

    # 2. AI 키워드 추출 호출
    keywords = extract_keywords_from_pdf(file_path)
    logger.info(f"🧠 키워드 추출 결과: {keywords}")

    # 3. DB 저장
    db = SessionLocal()
    try:
        keyword_entry = Keyword(
            file_id=file_id,
            filename=filename,
            keywords=keywords,
            user_id=current_user["user_id"]
        )
        db.add(keyword_entry)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error("❌ DB 저장 실패", exc_info=True)
        raise e
    finally:
        db.close()

    # 4. 응답 반환
    return {
        "file_id": file_id,
        "filename": filename,
        "keywords": keywords
    }
