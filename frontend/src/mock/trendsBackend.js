export const backendTrendMock = {
  role: "백엔드",
  technologies: [
    { name: "Spring Boot", percentage: 32, count: 2340, category: "framework" },
    { name: "Node.js", percentage: 27, count: 1980, category: "runtime" },
    { name: "Django", percentage: 17, count: 1240, category: "framework" },
    { name: "FastAPI", percentage: 14, count: 1045, category: "framework" },
    { name: "Express.js", percentage: 10, count: 770, category: "framework" }
  ],
  summary: "Spring Boot와 Node.js가 백엔드에서 가장 많이 사용되며, Python 기반 프레임워크도 강세입니다."
};

export const frontendTrendMock = {
  role: "프론트엔드",
  technologies: [
    { name: "React", percentage: 45, count: 2050, category: "framework" },
    { name: "Vue.js", percentage: 25, count: 1120, category: "framework" },
    { name: "JavaScript", percentage: 15, count: 690, category: "language" },
    { name: "Next.js", percentage: 10, count: 460, category: "framework" },
    { name: "Svelte", percentage: 5, count: 230, category: "framework" }
  ],
  summary: "React 기반 개발이 대세이며, Vue와 Next.js도 꾸준한 수요가 있습니다."
};

export const mobileTrendMock = {
  role: "모바일",
  technologies: [
    { name: "Kotlin", percentage: 40, count: 1200, category: "language" },
    { name: "Swift", percentage: 30, count: 900, category: "language" },
    { name: "Flutter", percentage: 20, count: 600, category: "framework" },
    { name: "React Native", percentage: 10, count: 300, category: "framework" }
  ],
  summary: "Kotlin과 Swift 중심의 네이티브 앱 개발이 주류이며, Flutter 수요도 꾸준합니다."
};


export const aiTrendMock = {
  role: "AI",
  technologies: [
    { name: "Python", percentage: 60, count: 2100, category: "language" },
    { name: "TensorFlow", percentage: 15, count: 525, category: "framework" },
    { name: "PyTorch", percentage: 10, count: 350, category: "framework" },
    { name: "Scikit-learn", percentage: 8, count: 280, category: "framework" },
    { name: "HuggingFace", percentage: 7, count: 245, category: "framework" }
  ],
  summary: "Python이 절대적인 우위를 점하고 있으며, PyTorch와 TensorFlow도 핵심 도구로 사용됩니다."
};
