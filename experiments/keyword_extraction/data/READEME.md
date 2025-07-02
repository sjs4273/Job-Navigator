# keyword\_extraction/data/README.md

이 디렉토리는 키워드 추출 실험에 사용되는 데이터셋을 저장합니다. 모든 파일은 JSON Lines (JSONL) 형식으로 구성되어 있으며, 각 줄은 하나의 문장과 그에 해당하는 키워드 정답(label)을 포함한 JSON 객체입니다.

## 📁 파일 목록

* `keyword_dataset.v1.jsonl`
  정제된 기술 키워드 정답 200개로 구성된 데이터셋

* `keyword_dataset.v2.jsonl`  
  - 약 300개 문장 수록, 주로 2~3문장 내외의 짧은 문장으로 구성  
  - MLflow 기반 다양한 키워드 추출 모델 테스트에 사용됨

* `keyword_dataset.v3.jsonl`  
  - 실제 이력서 문장과 비슷한 긴 문장 8개로 구성  
  - MLflow 기반 다양한 사전 모델 테스트에 사용됨

## 🧱 데이터 포맷 (JSONL)

각 줄은 다음과 같은 JSON 구조를 가집니다:

```json
{"sentence": "Spring Boot 기반 백엔드 서비스와 Redis 연동 경험이 있습니다.", "keywords": ["Spring Boot", "Redis"]}
```

* `sentence`: 텍스트 문장 (한글)
* `keywords`: 해당 문장에서 사람이 지정한 기술 키워드 리스트

## 🧪 사용 목적

* 키워드 추출 알고리즘의 정량 평가 (Precision, Recall, F1-score)
* MLflow 기반 실험에 사용되는 평가 기준
* 실험 재현 및 데이터 버전 관리

## 📌 버전 관리 정책

* 버전은 명시적으로 `v1`, `v2` 형식으로 파일명에 표시합니다.
* 주요 변경 사항은 커밋 메시지 및 최상위 `README.md`에 기록합니다.
* 예: `keyword_dataset.v2.jsonl` → 키워드 검수 반영 및 문장 50개 추가

## 📅 버전 히스토리

* **v1**  
  - 생성일: 2025-06-27  
  - 총 200개 문장  
  - 수작업 키워드 라벨 지정  
  - 실험 스크립트: `mlflow_keyword_experiment.py`와 연동됨

* **v2**  
  - 생성일: 2025-06-30  
  - 약 300개 문장 수록, 주로 2~3문장 내외의 짧은 문장으로 구성  
  - MLflow 기반 다양한 모델 테스트에 사용됨

* **v3**  
  - 생성일: 2025-07-02  
  - 실제 이력서 문장과 비슷한 긴 문장 8개로 구성  
  - MLflow 기반 다양한 사전 모델 테스트에 사용됨

