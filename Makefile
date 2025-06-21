# 기본 설정
UPSTREAM ?= upstream
BRANCH ?= main

.PHONY: help sync-main create-feature check-upstream

help:
	@echo "🛠️ 사용 가능한 명령어:"
	@echo "  make sync-main                - upstream/main → local main → origin/main 동기화"
	@echo "  make create-feature NAME=foo - 최신 main 기반 feature 브랜치 생성"
	@echo "  make check-upstream           - upstream 리모트 설정 확인"

check-upstream:
	@if ! git remote get-url $(UPSTREAM) >/dev/null 2>&1; then \
		echo "❌ [ERROR] '$(UPSTREAM)' 리모트가 존재하지 않습니다."; \
		echo "👉 다음 명령어로 추가하세요:"; \
		echo "   git remote add $(UPSTREAM) https://github.com/원본-유저명/원본-레포명.git"; \
		exit 1; \
	fi

sync-main: check-upstream
	git fetch $(UPSTREAM)
	git checkout $(BRANCH)
	git merge $(UPSTREAM)/$(BRANCH)
	git push origin $(BRANCH)

create-feature:
	@if [ -z "$(NAME)" ]; then \
		echo "❌ NAME이 필요합니다. 예: make create-feature NAME=feature/login"; \
		exit 1; \
	fi
	$(MAKE) sync-main
	git checkout -b $(NAME)
