# 📄 test_extractor.py

from pathlib import Path
from ai.extractor2 import extract_text_from_pdf, extract_keywords_from_text

def test_resume_extraction(file_path: str):
    if not Path(file_path).exists():
        print(f"❌ 파일이 존재하지 않습니다: {file_path}")
        return

    with open(file_path, "rb") as f:
        file_bytes = f.read()

    # ✅ 1. 텍스트 추출
    text = extract_text_from_pdf(file_bytes)
    print("📄 텍스트 추출 완료 (앞 500자):\n")
    print(text)
    print("\n" + "-"*80 + "\n")

    # ✅ 2. 키워드 리스트 추출
    keyword_list = extract_keywords_from_text(text)
    print("🧠 키워드 리스트 추출 결과:")
    print(keyword_list)
    print("\n" + "-"*80 + "\n")

if __name__ == "__main__":
    # 테스트할 이력서 PDF 파일 경로
    test_resume_extraction("./ai/자소서 (1).pdf")
