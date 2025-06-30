# ai/extractor.py

from typing import List
import re


def extract_keywords_from_text(text: str, top_k: int = 10) -> List[str]:
    """
    아주 간단한 TF 기반 키워드 추출기 (예시)
    - 불용어 제거, 길이 필터링 포함
    """
    from collections import Counter

    stopwords = {"the", "and", "is", "in", "to", "of", "a", "for", "on", "with"}
    words = re.findall(r"\b\w{2,}\b", text.lower())
    filtered = [w for w in words if w not in stopwords]
    counter = Counter(filtered)
    return [w for w, _ in counter.most_common(top_k)]


def extract_keywords_from_pdf(content: bytes) -> List[str]:
    import io
    from PyPDF2 import PdfReader

    reader = PdfReader(io.BytesIO(content))
    full_text = "\n".join(page.extract_text() or "" for page in reader.pages)
    return extract_keywords_from_text(full_text)
