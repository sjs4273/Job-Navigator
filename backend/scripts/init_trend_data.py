# 📄 scripts/init_trend_data.py

import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from dotenv import load_dotenv
from app.core.database import SessionLocal
from app.models.market_trends import MarketTrendORM
from app.services.trend_service import collect_trend_by_role

# ✅ 환경변수 로드 (.env)
load_dotenv()

# ✅ 수집 대상 직무 목록
ROLES = ["backend", "frontend", "mobile", "ai"]

def init_all_trends():
    db = SessionLocal()
    try:
        print("🧹 기존 MarketTrend 데이터 전체 삭제 중...")
        db.query(MarketTrendORM).delete()
        db.commit()
        print("✅ 삭제 완료!")

        for role in ROLES:
            print(f"\n📡 기술 트렌드 수집 시작 ({role})...")
            data = collect_trend_by_role(role)
            trend = MarketTrendORM(role=role, data=data)
            db.add(trend)
            print(f"✅ {role} 트렌드 저장 완료!")

        db.commit()
        print("\n✅ 모든 직무 트렌드 저장 완료!")
    except Exception as e:
        db.rollback()
        print(f"❌ 오류 발생: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_all_trends()
