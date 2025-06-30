import { useState, useEffect } from 'react';
import './TrendPage.css';

function TrendPage() {
  const [trendData, setTrendData] = useState([]);
  const [summary, setSummary] = useState('');
  const [displayedSummary, setDisplayedSummary] = useState('');
  const [activeTab, setActiveTab] = useState('백엔드');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [tabClicked, setTabClicked] = useState(() => {
    return localStorage.getItem('trend_tab_visited') === 'true';
  });

  const skillCategories = {
    백엔드: {
      languages: ['Python', 'Java', 'Node.js', 'Go', 'Rust', 'Kotlin', 'TypeScript'],
      frameworks: ['Django', 'Spring Boot', 'Express.js', 'FastAPI', 'NestJS'],
    },
    프론트엔드: {
      languages: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
      frameworks: ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte'],
    },
    모바일: {
      languages: ['Kotlin', 'JavaScript', 'Swift', 'Dart'],
      frameworks: ['Flutter', 'React Native'],
    },
    AI: {
      languages: ['Python', 'R', 'SQL'],
      frameworks: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'HuggingFace'],
    },
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const tabToQueryParam = {
          '백엔드': 'backend',
          '프론트엔드': 'frontend',
          '모바일': 'mobile',
          'AI': 'data',
        };
        const roleQuery = tabToQueryParam[activeTab];
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        const response = await fetch(`${baseUrl}/api/v1/trends/roles/${roleQuery}`);
        if (!response.ok) throw new Error('응답 실패');

        const data = await response.json();
        setTrendData(data.top_5);
        setSummary(data.summary);
        setSelectedSkills([]);
      } catch (error) {
        console.error('📛 기술 트렌드 데이터를 불러오는 중 오류 발생:', error);
        setTrendData([]);
        setSummary('데이터를 불러오지 못했습니다.');
      }
    };

    fetchTrendData();
  }, [activeTab]);

  useEffect(() => {
    if (!summary) return;

    const processed = summary.replace(/\. /g, '.\n');
    const chars = Array.from(processed);
    setDisplayedSummary(''); // 초기화

    let isCancelled = false;

    const streamText = async (i) => {
      if (i >= chars.length || isCancelled) return;
      setDisplayedSummary((prev) => prev + chars[i]);
      setTimeout(() => streamText(i + 1), 30);
    };

    streamText(0);

    return () => {
      isCancelled = true; // 언마운트 시 인터럽트
    };
  }, [summary]);

  return (
    <div className="container">
      {/* 상단 탭 */}
      <div className="tab-wrapper">
        {!tabClicked && (
          <div className="tab-guide-bubble">
            탭을 클릭해서 최신 공고를 확인해보세요!
          </div>
        )}
        <div className="tab-menu top-tab">
          {['백엔드', '프론트엔드', '모바일', 'AI'].map((tab) => (
            <button
              key={tab}
              className={`pill ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                setTabClicked(true);
                localStorage.setItem('trend_tab_visited', 'true');
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 언어 필터 */}
      <div className={`select-box ${trendData.length > 0 ? 'active' : ''}`}>
        <div className="tab-menu">
          {skillCategories[activeTab].languages.map((lang) => (
            <button
              key={lang}
              className={`pill ${selectedSkills.includes(lang) ? 'active' : ''}`}
              onClick={() => toggleSkill(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* 프레임워크 필터 */}
      <div className={`select-box ${trendData.length > 0 ? 'active' : ''}`}>
        <div className="tab-menu">
          {skillCategories[activeTab].frameworks.map((fw) => (
            <button
              key={fw}
              className={`pill ${selectedSkills.includes(fw) ? 'active' : ''}`}
              onClick={() => toggleSkill(fw)}
            >
              {fw}
            </button>
          ))}
        </div>
      </div>

      {/* 기술 트렌드 */}
      <h2 className="title">{activeTab} 기술 트렌드 (채용공고 기준)</h2>
      <div className="trend-list">
        {trendData.map((tech, idx) => (
          <div key={idx} className="trend-card">
            <div className="trend-header">
              <span className="tech-name">{tech.name}</span>
              <span className="tech-percent">{tech.percentage}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${tech.percentage}%` }}
              ></div>
            </div>
            <span className="job-count">
              {tech.count.toLocaleString()}개 공고
            </span>
          </div>
        ))}
      </div>

      {/* 기술 요약 */}
      <div className="summary-box">
        <p className="summary-title">기술 요약</p>
        {displayedSummary.split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default TrendPage;
