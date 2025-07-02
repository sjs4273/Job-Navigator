import json
import openai
import os
import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.resume import ResumeORM
from app.services.gpt_payload_builder import build_gpt_messages

# 🔐 환경변수로부터 OpenAI API 키 로드
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY 환경변수가 설정되지 않았습니다.")

client = openai.OpenAI(api_key=OPENAI_API_KEY)
logger = logging.getLogger(__name__)


async def analyze_resume_with_gpt(db: Session, resume_id: int, user_id: int) -> dict:
    """
    주어진 이력서 ID에 대해 GPT 분석을 수행하고 결과를 DB에 저장 후 반환합니다.
    """
    # ✅ 사용자 본인의 이력서인지 검증
    resume = db.query(ResumeORM).filter(
        ResumeORM.resume_id == resume_id,
        ResumeORM.user_id == user_id
    ).first()

    if not resume:
        raise HTTPException(status_code=404, detail="해당 이력서를 찾을 수 없습니다.")

    # ✅ 메시지 구성
    messages = await build_gpt_messages(db, resume_id)

    try:
        # ✅ GPT 호출
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.3,
            max_tokens=3000
        )

        # ✅ 응답 확인 및 전처리
        gpt_content = response.choices[0].message.content
        logger.info(f"📥 GPT 응답:\n{gpt_content!r}")

        if not gpt_content or gpt_content.strip() == "":
            raise HTTPException(status_code=500, detail="GPT 응답이 비어 있습니다.")

        # ✅ GPT 응답에서 Markdown 코드블럭 제거
        gpt_content = gpt_content.strip()
        if gpt_content.startswith("```"):
            gpt_content = gpt_content.strip("` \n")
            if gpt_content.startswith("json"):
                gpt_content = gpt_content[4:].strip()

        # ✅ 문자열 → dict 파싱
        try:
            result_json = json.loads(gpt_content)
        except json.JSONDecodeError as json_err:
            raise HTTPException(status_code=500, detail=f"GPT 응답 JSON 파싱 실패: {json_err}")

        # ✅ DB 저장 (dict 그대로 저장 → JSONB 필드 호환)
        resume.gpt_response = result_json
        db.commit()

        return result_json

    except openai.APIError as api_error:
        raise HTTPException(status_code=500, detail=f"OpenAI API 오류: {api_error}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GPT 분석 실패: {e}")
