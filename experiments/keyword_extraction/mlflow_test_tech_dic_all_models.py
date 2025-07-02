# mlflow_test_tech_all_models.py
"""
세 가지 기술 키워드 추출 모델(대사전, 소사전, 동의어 매핑)을
한 파일에서 MLflow를 이용해 평가하는 통합 실험 코드입니다.

- DictionaryFullTechSkill: 전체 기술 키워드 대사전 기반 추출
- DictionaryReducedKeywords: 분야별 대표 기술명 소사전 기반 추출
- DictionaryFullEquivalents: 동의어/오탈자 포함 표준명 매핑 모델
"""

import json
import re
from tqdm import tqdm
import mlflow
import nltk
from typing import List

from mlflow_test_tech_dict import FULL_TECH_STACK, REDUCED_TECH_KEYWORDS, TECH_EQUIVALENTS

# nltk 토큰화 패키지 다운로드 (실험시 필요한 경우)
nltk.download("punkt", quiet=True)

def load_dataset(path: str):
    """
    JSONL 형식의 데이터셋 파일을 읽어 리스트로 반환
    """
    with open(path, "r", encoding="utf-8") as f:
        return [json.loads(line) for line in f]

def extract_keywords_full_tech_stack(text: str, tech_stack: List[str]) -> List[str]:
    """
    대사전(FULL_TECH_STACK) 기반 기술 키워드 추출
    - 단어 경계, 조사, 공백, 구두점 등을 고려해 robust하게 매칭
    """
    found_keywords = set()
    lowered_text = text.lower()
    for keyword in tech_stack:
        patterns = [
            rf"\b{re.escape(keyword.lower())}\b",                   # 완전 단어 매칭
            rf"{re.escape(keyword.lower())}(?=[을를이가는은에서와과])", # 조사 뒤에 오는 경우
            rf"{re.escape(keyword.lower())}(?=\s)",                 # 공백 뒤
            rf"{re.escape(keyword.lower())}(?=[.,!?])",             # 구두점 앞
        ]
        if any(re.search(p, lowered_text) for p in patterns):
            found_keywords.add(keyword)
    return sorted(found_keywords)

def extract_keywords_reduced(text: str) -> List[str]:
    """
    소사전(REDUCED_TECH_KEYWORDS) 기반 기술 키워드 추출
    - 분야별 대표 기술명 카테고리 딕셔너리에서 추출
    """
    found_keywords = set()
    lowered_text = text.lower()
    for category_keywords in REDUCED_TECH_KEYWORDS.values():
        for keyword in category_keywords:
            k = keyword.lower()
            patterns = [
                r'\b' + re.escape(k) + r'\b',
                re.escape(k) + r'(?=[을를이가는은에서와과])',
                re.escape(k) + r'(?=\s)',
                re.escape(k) + r'(?=[.,!?])',
            ]
            if any(re.search(p, lowered_text) for p in patterns):
                found_keywords.add(keyword)
    return sorted(found_keywords)

def extract_keywords_full_equivalents(text: str, equivalents_dict) -> List[str]:
    """
    동의어/오탈자 포함 표준 기술명 반환 모델
    - 표준 기술명 키와 그 변형(alias)들을 매칭해 표준명으로 변환하여 추출
    """
    found_keywords = set()
    lowered_text = text.lower()
    for standard, variants in equivalents_dict.items():
        for alias in variants:
            a = alias.lower()
            patterns = [
                r'\b' + re.escape(a) + r'\b',
                re.escape(a) + r'(?=[을를이가는은에서와과])',
                re.escape(a) + r'(?=\s)',
                re.escape(a) + r'(?=[.,!?])',
            ]
            if any(re.search(p, lowered_text) for p in patterns):
                found_keywords.add(standard)  # 표준명으로 추가
                break
    return sorted(found_keywords)

def evaluate(pred, gold):
    """
    예측(pred)과 정답(gold) 키워드 리스트로부터
    Precision, Recall, F1 Score 계산 반환
    """
    p_set, g_set = set(pred), set(gold)
    tp = len(p_set & g_set)  # True Positive
    fp = len(p_set - g_set)  # False Positive
    fn = len(g_set - p_set)  # False Negative
    precision = tp / (tp + fp + 1e-10)  # 정밀도
    recall = tp / (tp + fn + 1e-10)     # 재현율
    f1 = 2 * precision * recall / (precision + recall + 1e-10)  # F1 스코어
    return precision, recall, f1

def save_simple_predicted_keywords(samples, predictions, output_path="predicted_keywords_simple.txt"):
    """
    정답 키워드와 예측 키워드를 사람이 읽기 쉬운 텍스트 파일로 저장
    """
    with open(output_path, "w", encoding="utf-8") as f:
        for sample, pred in zip(samples, predictions):
            true_str = ", ".join(sample["keywords"])
            pred_str = ", ".join(pred)
            f.write(f"[정답] {true_str}\n")
            f.write(f"[예측] {pred_str}\n")
            f.write("-----\n")
    print(f"간단 형식 예측 결과가 '{output_path}' 파일로 저장되었습니다.")

def run_experiment(dataset_path: str, models: list):
    """
    데이터셋 경로와 실행할 모델 리스트를 받아 MLflow 실험 실행
    """
    data = load_dataset(dataset_path)
    mlflow.set_experiment("ShortSentenceKeywordExtraction")

    for model_name in models:
        # 모델별 추출 함수, 설명, 사전 크기, 런 이름 설정
        if model_name == "DictionaryFullTechSkill":
            extract_func = lambda text: extract_keywords_full_tech_stack(text, FULL_TECH_STACK)
            model_desc = "전체 기술 키워드 사전(FULL_TECH_STACK) 기반, 대사전"
            tech_stack_size = len(FULL_TECH_STACK)
            run_name = "[Full] FullTechSkill"
        elif model_name == "DictionaryReducedKeywords":
            extract_func = extract_keywords_reduced
            model_desc = "분야별 대표 기술명만 (REDUCED_TECH_KEYWORDS 기반, 소사전)"
            tech_stack_size = sum(len(v) for v in REDUCED_TECH_KEYWORDS.values())
            run_name = "[Reduce] Representative only"
        elif model_name == "DictionaryFullEquivalents":
            extract_func = lambda text: extract_keywords_full_equivalents(text, TECH_EQUIVALENTS)
            model_desc = "동의어/변형/오탈자 포함 (TECH_EQUIVALENTS 기반, 표준 기술명 반환)"
            tech_stack_size = len(TECH_EQUIVALENTS)
            run_name = "[Full] Synonym/Eq-mapping"
        else:
            raise ValueError(f"Unknown model: {model_name}")

        # MLflow Run 시작
        with mlflow.start_run(run_name=run_name, description=model_desc):
            mlflow.log_param("model_name", model_name)
            mlflow.log_param("run_name", run_name)
            mlflow.log_param("stack_label", model_name)
            mlflow.log_param("model_desc", model_desc)
            mlflow.log_param("tech_stack_size", tech_stack_size)

            ps, rs, f1s = [], [], []
            results = []
            all_predictions = []

            # 데이터셋 항목별 예측 및 평가 수행
            for item in tqdm(data, desc=f"[{model_name}]"):
                sent, gold = item["sentence"], item["keywords"]
                pred = extract_func(sent)
                all_predictions.append(pred)
                p, r, f1 = evaluate(pred, gold)
                ps.append(p)
                rs.append(r)
                f1s.append(f1)
                results.append({
                    "sentence": sent,
                    "true_keywords": gold,
                    "predicted_keywords": pred,
                    "precision": round(p, 4),
                    "recall": round(r, 4),
                    "f1": round(f1, 4)
                })

            # 평균 지표 계산
            avg_p = sum(ps) / len(ps)
            avg_r = sum(rs) / len(rs)
            avg_f1 = sum(f1s) / len(f1s)

            # MLflow에 평균 지표 기록
            mlflow.log_metric("avg_precision", avg_p)
            mlflow.log_metric("avg_recall", avg_r)
            mlflow.log_metric("avg_f1", avg_f1)

            # 결과 JSONL 파일 저장 및 MLflow 아티팩트 등록
            result_path_jsonl = f"predicted_keywords_{model_name}.jsonl"
            with open(result_path_jsonl, "w", encoding="utf-8") as f_jsonl:
                for item in results:
                    f_jsonl.write(json.dumps(item, ensure_ascii=False) + "\n")
            mlflow.log_artifact(result_path_jsonl)

            # 간단한 텍스트 파일로 정답/예측 키워드 저장 및 아티팩트 등록
            result_path_txt = f"predicted_keywords_simple_{model_name}.txt"
            save_simple_predicted_keywords(data, all_predictions, result_path_txt)
            mlflow.log_artifact(result_path_txt)

            # 콘솔 출력
            print(f"\n📊 [{run_name}] ({model_desc}) 결과  P={avg_p:.4f}  R={avg_r:.4f}  F1={avg_f1:.4f}")

if __name__ == "__main__":
    models_to_run = [
        "DictionaryFullTechSkill",
        "DictionaryReducedKeywords",
        "DictionaryFullEquivalents"
    ]
    print("🚀 Starting Combined TECH Stack Dictionary Evaluation...")
    print(f"🎯 Testing models: {models_to_run}")
    run_experiment("data/keywords_dataset.v2.jsonl", models=models_to_run)
