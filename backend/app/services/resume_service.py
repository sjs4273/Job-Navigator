# /backend/app/service/keyword_service.py

import os
import uuid
import shutil
import logging
from fastapi import UploadFile
from sqlalchemy.orm import Session
from ai.extractor import extract_text_from_pdf, extract_keywords_from_text
from app.core.database import SessionLocal
from app.models.resume import ResumeORM
from app.models.user import UserORM
from app.services.job_classifier import classify_job_category

logger = logging.getLogger(__name__)

async def extract_and_save_keywords(current_user: UserORM, pdf_file: UploadFile) -> ResumeORM:
    """
    PDF 파일을 저장한 후 텍스트를 추출하고, 키워드를 분석하여 Resume 테이블에 저장합니다.

    Parameters:
        current_user (UserORM): 인증된 사용자 객체
        pdf_file (UploadFile): 업로드된 PDF 파일 객체

    Returns:
        ResumeORM: 저장된 이력서 ORM 객체
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

    # 2. PDF 텍스트 추출
    with open(file_path, "rb") as f:
        file_bytes = f.read()
    text = extract_text_from_pdf(file_bytes)
    logger.info(f"📝 텍스트 추출 완료 (길이: {len(text)}자)")

    # 3. 텍스트 기반 키워드 추출
    keywords = extract_keywords_from_text(text)
    job_category = classify_job_category(keywords)  # ✅ 직무 분류
    logger.info(f"🧠 키워드 추출 결과: {keywords}")

    # 4. DB 저장
    db: Session = SessionLocal()
    try:
        resume_entry = ResumeORM(
            user_id=current_user.user_id,
            file_path=file_path,
            filename=filename,
            extracted_keywords=keywords,
            resume_text=text,  # ✅ 이 줄이 필수입니다
            job_category=job_category,   # 추후 자동 분류 예정
        )
        logger.info(filename)
        logger.info("💾 ResumeORM 객체 생성 완료")
        db.add(resume_entry)
        db.commit()
        db.refresh(resume_entry)
        logger.info(f"✅ ResumeORM 저장 완료: resume_id={resume_entry.resume_id}")
        return resume_entry
    except Exception as e:
        db.rollback()
        logger.error("❌ Resume 저장 실패", exc_info=True)
        raise e
    finally:
        db.close()

def delete_resume_by_id(db: Session, resume_id: int, user_id: int) -> None:
    """
    주어진 resume_id와 user_id를 기반으로 이력서를 삭제합니다.

    Parameters:
        db (Session): SQLAlchemy DB 세션
        resume_id (int): 삭제할 Resume ID
        user_id (int): 현재 로그인한 사용자 ID

    Raises:
        HTTPException: 이력서가 없거나 권한이 없을 경우
    """
    resume = db.query(ResumeORM).filter(
        ResumeORM.resume_id == resume_id,
        ResumeORM.user_id == user_id
    ).first()

    if not resume:
        raise HTTPException(status_code=404, detail="삭제할 이력서를 찾을 수 없습니다.")

    # 저장된 PDF 파일 삭제 시도
    try:
        if resume.file_path and os.path.exists(resume.file_path):
            os.remove(resume.file_path)
            logger.info(f"🗑️ PDF 파일 삭제 완료: {resume.file_path}")
    except Exception as file_error:
        logger.warning(f"⚠️ 파일 삭제 중 오류 발생: {file_error}")

    db.delete(resume)
    db.commit()
    logger.info(f"✅ 이력서 DB 삭제 완료 (resume_id={resume_id})")