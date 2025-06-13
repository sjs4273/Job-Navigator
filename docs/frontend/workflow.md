
# 🧭 Frontend 개발 워크플로 가이드

이 문서는 Vite + React 기반 프론트엔드 개발자가 따라야 할 기본적인 작업 흐름을 안내합니다.  
로컬 개발 환경에서 프로젝트를 실행하고, 테스트하고, 코드 포맷팅 후 Git에 커밋/푸시하는 전반적인 과정을 포함합니다.

---

## 📦 1. 개발 환경 준비

1. 의존성 설치
```bash
npm install
```

2. 개발 서버 실행
```bash
npm run dev
```

서버는 보통 http://localhost:5173 에서 실행됩니다.

---

## 🧪 2. 테스트 실행 (Vitest)

1. 전체 테스트 실행
```bash
npx vitest run
```

2. 테스트 UI 실행 (선택 사항)
```bash
npx vitest --ui
```

> 테스트 파일은 일반적으로 `src/__test__/` 또는 `*.test.jsx` 형태로 구성됩니다.

---

## 🎨 3. 코드 포맷팅 (Prettier + ESLint)

### Prettier 포맷팅
```bash
npx prettier --write .
```

### ESLint 정적 분석
```bash
npx eslint . --ext .js,.jsx,.ts,.tsx
```

> 대부분의 경우 `package.json`에 스크립트로 정의되어 있으므로 아래처럼 실행 가능:
```bash
npm run lint
npm run format
```

---

## 💾 4. Git 커밋 & 푸시 흐름

### 🔍 변경사항 확인
```bash
git status
```

### ➕ 변경 파일 추가
```bash
git add .
```

### 💬 커밋 메시지 작성
```bash
git commit -m "🎨 style: 헤더 컴포넌트 스타일 수정"
```

> 🔸 커밋 메시지 접두사 예시
- `✨ feat`: 새로운 기능 추가
- `🐛 fix`: 버그 수정
- `🎨 style`: 코드 포맷팅, UI 수정
- `🧪 test`: 테스트 코드 추가
- `🛠️ chore`: 설정 변경, 의존성 관리

### ⬆️ GitHub에 푸시
```bash
git push origin main
```

---

## 🧭 전체 요약

```bash
# 1. 코드 작성 전
git pull origin main

# 2. 기능 개발
(코드 작성)

# 3. 포맷팅 및 테스트
npm run format
npm run lint
npx vitest run

# 4. 커밋 및 푸시
git add .
git commit -m "✨ feat: ..."
git push origin main
```

---

## 🙋‍♀️ 협업 시 유의사항

- 기능 단위로 커밋하고 명확한 메시지를 작성하세요.
- 포맷팅과 린트는 PR 전에 반드시 수행하세요.
- `main` 대신 `feature/브랜치이름` 브랜치를 활용하는 것도 좋습니다.

---

이 문서는 초급 프론트엔드 개발자가 실수 없이 작업할 수 있도록 구성되었습니다.  
필요에 따라 자유롭게 업데이트해주세요!
