import { useState, useEffect } from 'react';
import {
  backendTrendMock,
  frontendTrendMock,
  mobileTrendMock,
  aiTrendMock,
} from '../mock/trendsBackend';
import './TrendPage.css';

function TrendPage() {
  const [trendData, setTrendData] = useState([]);
  const [summary, setSummary] = useState('');
  const [activeTab, setActiveTab] = useState('백엔드');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [tabClicked, setTabClicked] = useState(() => {
    return localStorage.getItem('trend_tab_visited') === 'true';
  });

  const skillCategories = {
    백엔드: {
      languages: [
        'Python',
        'Java',
        'Node.js',
        'Go',
        'Rust',
        'Kotlin',
        'TypeScript',
      ],
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
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  useEffect(() => {
    let data;
    if (activeTab === '백엔드') data = backendTrendMock;
    else if (activeTab === '프론트엔드') data = frontendTrendMock;
    else if (activeTab === '모바일') data = mobileTrendMock;
    else if (activeTab === 'AI') data = aiTrendMock;

    setTrendData(data.technologies);
    setSummary(data.summary);
    setSelectedSkills([]);
  }, [activeTab]);

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
          {skillCategories[activeTab].languages.map((lang, idx) => (
            <button
              key={idx}
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
          {skillCategories[activeTab].frameworks.map((fw, idx) => (
            <button
              key={idx}
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

      {/* 요약 */}
      <div className="summary-box">
        {(() => {
          const sentences = summary.match(/[^.!?]*(?:다|요|니다)\./g) || [
            summary,
          ];
          return (
            <>
              <p className="summary-title">{sentences[0]}</p>
              <p>{sentences.slice(1).join(' ')}</p>
            </>
          );
        })()}
      </div>
    </div>
  );
}

export default TrendPage;
