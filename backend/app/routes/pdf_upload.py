from fastapi import APIRouter, UploadFile, File
import shutil
import os

router = APIRouter()

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)  # ✅ 없으면 자동 생성
    file_location = f"uploads/{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"✅ PDF 저장 완료: {file_location}")

    return {"filename": file.filename, "message": "파일 업로드 성공!"}

