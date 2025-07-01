import { useState, useEffect } from 'react';
import TechTrendDashboard from '../components/TechTrendDashboard.jsx';
import SummaryBox from '../components/SummaryBox.jsx';
import './TrendPage.css';

function TrendPage() {
  const [trendData, setTrendData] = useState([]);
  const [summary, setSummary] = useState('');
  const [displayedSummary, setDisplayedSummary] = useState('');
  const [activeTab, setActiveTab] = useState('백엔드');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [tabClicked, setTabClicked] = useState(() => localStorage.getItem('trend_tab_visited') === 'true');
  const [animate, setAnimate] = useState(false);
  const [showSummaryBox, setShowSummaryBox] = useState(false); // ✅ 3초 후에 true로 변경

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
        setAnimate(false);
        setTimeout(() => setAnimate(true), 100);
        setShowSummaryBox(false);
        setTimeout(() => setShowSummaryBox(true), 5000); // ✅ 3초 후에 요약 박스 표시
      } catch (error) {
        console.error('📛 기술 트렌드 데이터를 불러오는 중 오류 발생:', error);
        setTrendData([]);
        setSummary('데이터를 불러오지 못했습니다.');
      }
    };

    fetchTrendData();
  }, [activeTab]);

  return (
    <div className="container">
      {/* 상단 탭 */}
      <div className="tab-wrapper">
        {!tabClicked && (
          <div className="tab-guide-bubble">탭을 클릭해서 최신 공고를 확인해보세요!</div>
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

      {/* 기술 트렌드 */}
      <h2 className="title">{activeTab} 상위 5개 기술 트렌드 (채용공고 기준)</h2>
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
                style={{
                  width: animate ? `${tech.percentage}%` : 0,
                  transition: 'width 1.2s ease-in-out',
                  transitionDelay: `${idx * 0.1}s`,
                }}
              ></div>
            </div>
            <span className="job-count">{tech.count.toLocaleString()}개 공고</span>
          </div>
        ))}
      </div>

      {/* 기술 요약 */}
      {showSummaryBox ? (
        <SummaryBox
          summary={summary}
          displayedSummary={displayedSummary}
          setDisplayedSummary={setDisplayedSummary}
        />
      ) : (
        <div className="summary-box">
          <p className="summary-title">기술 요약</p>
          <p>✍️ 요약 생성 중입니다...</p>
        </div>
      )}

      {/* 마켓 기반 기술 트렌드 시각화 */}
      <div style={{ marginTop: '60px' }}>
        <h2 className="title">📊 마켓 기반 기술 트렌드 분석</h2>
        <TechTrendDashboard />
      </div>
    </div>
  );
}

export default TrendPage;
