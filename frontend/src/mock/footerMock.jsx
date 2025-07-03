// 📄 mock/footerMock.js
import {
    BarChart2,
    TrendingUp,
    Map,
    Briefcase,
    UploadCloud,
    SearchCheck,
    Goal,
  } from "lucide-react";
  
  export const services = [
    {
      icon: <BarChart2 size={32} />,
      title: "기술스택 분석",
      description: "이력서에서 추출한 기술 키워드를 분석합니다.",
    },
    {
      icon: <TrendingUp size={32} />,
      title: "기술 트렌드 대시보드",
      description: "최근 인기 기술 트렌드를 한눈에 확인합니다.",
    },
    {
      icon: <Map size={32} />,
      title: "커리어 로드맵",
      description: "부족한 기술 기반 학습 로드맵을 추천해 드립니다.",
    },
    {
      icon: <Briefcase size={32} />,
      title: "맞춤형 채용 공고",
      description: "기술스택과 연관된 채용 공고를 보여드립니다.",
    },
  ];
  
  export const flowSteps = [
    { icon: <UploadCloud size={28} />, label: "이력서 업로드" },
    { icon: <SearchCheck size={28} />, label: "기술스택 분석" },
    { icon: <TrendingUp size={28} />, label: "트렌드 확인" },
    { icon: <Goal size={28} />, label: "커리어 로드맵 생성" },
  ];
  
  export const reviews = [
    { quote: "이력서를 업로드하니 부족한 기술이 명확해졌어요.", name: "예비 백엔드 개발자 김OO" },
    { quote: "커리어 로드맵 덕분에 백엔드 개발자로 취업 준비 중입니다.", name: "국비 수강생 박OO" },
    { quote: "기술 트렌드 분석 덕분에 요즘 시장 흐름을 쉽게 파악할 수 있었어요.", name: "프론트엔드 취준생 이OO" },
    { quote: "자소서에 쓸 기술 키워드를 명확히 알 수 있어서 유용했어요.", name: "취업 준비생 최OO" },
    { quote: "맞춤형 채용공고가 진짜 도움됐습니다. 불필요한 검색이 줄었어요.", name: "주니어 개발자 박OO" },
    { quote: "기술스택 추천을 받고 나니 학습 우선순위를 정할 수 있었어요.", name: "비전공자 전OO" },
    { quote: "다른 트렌드 사이트보다 직관적이고 깔끔해서 자주 쓰게 돼요.", name: "취업 준비생 송OO" },
    { quote: "이력서 분석 결과를 바탕으로 포트폴리오 방향을 다시 잡았어요.", name: "풀스택 지망생 정OO" },
    { quote: "AI가 추천해주는 학습 로드맵이 생각보다 정교해서 놀랐어요.", name: "컴퓨터공학 전공생 유OO" },
    { quote: "트렌드 대시보드 보고 최신 기술 따라잡고 있습니다.", name: "프론트엔드 개발자 김OO" },
  ];
  