import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, Filter, RefreshCw } from 'lucide-react';
import './TechTrendDashboard.css';

// ✅ 언어별 색상 매핑
const LANGUAGE_COLOR_MAP = {
  Python: "#4B8BBE",
  Java: "#F89820",
  JavaScript: "#F7DF1E",
  TypeScript: "#007ACC",
  C: "#A8B9CC",
  "C++": "#00599C",
  "C#": "#9B4F96",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Kotlin: "#7F52FF",
  Ruby: "#CC342D",
  PHP: "#8892BF",
  Swift: "#FF5F00",
  Dart: "#0175C2",
  Default: "#8884d8"
};

const TechTrendDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('backend');
  const [isLoading, setIsLoading] = useState(false);
  const [trendData, setTrendData] = useState(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchTrendData = async (role) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/api/v1/trends/market/${role}`);
      if (!response.ok) throw new Error('응답 실패');
      const result = await response.json();
      console.log('✅ 가져온 마켓 트렌드:', result);
      setTrendData(result.data);
    } catch (error) {
      console.error('❌ 트렌드 데이터 가져오기 실패:', error);
      setTrendData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendData(selectedCategory);
  }, [selectedCategory]);

  const refreshData = () => {
    fetchTrendData(selectedCategory);
  };

  return (
    <div className="dashboard-wrapper">
      {/* 헤더 */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-icon"><TrendingUp className="icon-lg" /></div>
          <div>
            <h1 className="dashboard-title">Tech Market Trends</h1>
            <p className="dashboard-subtitle">GitHub · Google Trends · Stack Overflow 종합 분석</p>
          </div>
        </div>
        <button onClick={refreshData} className="refresh-btn" disabled={isLoading}>
          <RefreshCw className={`icon-sm ${isLoading ? 'spin' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

      {/* 필터 */}
      <div className="dashboard-filters">
        <div className="filter-group">
          <Filter className="icon-sm filter-icon" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="backend">백엔드</option>
            <option value="frontend">프론트엔드</option>
            <option value="mobile">모바일</option>
            <option value="ai">AI/ML</option>
          </select>
        </div>
      </div>

      {/* ✅ GitHub 언어 분포 */}
      {trendData?.github_language_distribution?.length > 0 && (
        <div className="trend-list">
          <h2 className="summary-title">GitHub 언어 분포</h2>
          <p className="chart-description">GitHub에 가장 많이 사용된 프로그래밍 언어 비율을 보여줍니다.</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trendData.github_language_distribution}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {trendData.github_language_distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={LANGUAGE_COLOR_MAP[entry.name] || LANGUAGE_COLOR_MAP.Default} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ✅ 기술 종합 분석 RadarChart */}
      {trendData?.radar_score?.length > 0 && (
        <div className="trend-list">
          <h2 className="summary-title">기술 종합 분석</h2>
          <p className="chart-description">GitHub, Stack Overflow, Google Trends 데이터를 기반으로 기술별 인기도를 비교합니다.</p>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={trendData.radar_score}>
              <PolarGrid />
              <PolarAngleAxis dataKey="technology" />
              <PolarRadiusAxis />
              <Radar name="GitHub" dataKey="github" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              <Radar name="Stack Overflow" dataKey="stackoverflow" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              <Radar name="Google Trends" dataKey="trends" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ✅ 레포 증가량 LineChart */}
      {trendData?.repo_growth?.length > 0 && (
        <div className="trend-list">
          <h2 className="summary-title">GitHub 레포 증가량</h2>
          <p className="chart-description">월별로 주요 언어별 GitHub 레포지토리 수의 증가 추이를 확인할 수 있습니다.</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData.repo_growth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(trendData.repo_growth[0])
                .filter(key => key !== 'month')
                .map((lang, i) => (
                  <Line key={i} type="monotone" dataKey={lang} stroke={LANGUAGE_COLOR_MAP[lang] || "#8884d8"} />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ✅ 인기 라이브러리 다운로드 BarChart */}
      {trendData?.popular_libraries?.length > 0 && (
        <div className="trend-list">
          <h2 className="summary-title">인기 오픈소스 라이브러리</h2>
          <p className="chart-description">
            NPM 또는 PyPI 등에서 많이 다운로드된 오픈소스 라이브러리 순위를 보여줍니다.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={trendData.popular_libraries}
              margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1_000_000) return `${value / 1_000_000}M`;
                  if (value >= 1_000) return `${value / 1_000}K`;
                  return value;
                }}
              />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Bar dataKey="downloads" fill="#82ca9d" barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {trendData?.google_trends?.length > 0 && (
        <div className="trend-list">
          <h2 className="summary-title">📈 Google 검색 트렌드 변화</h2>
          <p className="chart-description">주간 기준으로 기술 키워드의 검색량 추이를 나타냅니다.</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData.google_trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />

              {/* ✅ 커스텀 Tooltip */}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const sorted = [...payload].sort((a, b) => b.value - a.value);
                    return (
                      <div className="custom-tooltip" style={{ background: "#fff", padding: 10, border: "1px solid #ccc" }}>
                        <p className="label">{label}</p>
                        {sorted.map((entry) => (
                          <p key={entry.name} style={{ color: entry.color, margin: 0 }}>
                            {entry.name}: {entry.value}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* ✅ 커스텀 Legend (전 주차 기준 정렬) */}
              <Legend
                content={({ payload }) => {
                  const prev = trendData.google_trends.length - 2;  // 이전 주차
                  const sorted = [...payload].sort(
                    (a, b) =>
                      trendData.google_trends[prev][b.value] -
                      trendData.google_trends[prev][a.value]
                  );
                  return (
                    <ul className="custom-legend" style={{ display: "flex", listStyle: "none", gap: "12px", marginTop: 10 }}>
                      {sorted.map((entry) => (
                        <li key={entry.value} style={{ color: entry.color }}>
                          {entry.value}
                        </li>
                      ))}
                    </ul>
                  );
                }}
              />

              {/* ✅ 최신 주차 기준 라인 정렬 */}
              {Object.entries(
                trendData.google_trends[trendData.google_trends.length - 1]
              )
                .filter(([key]) => key !== "week" && key !== "isPartial")
                .sort(([, a], [, b]) => b - a)
                .map(([tech]) => (
                  <Line
                    key={tech}
                    type="monotone"
                    dataKey={tech}
                    stroke={LANGUAGE_COLOR_MAP[tech] || "#8884d8"}
                    name={tech}
                    dot={false}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}


      {/* ✅ StackOverflow 설문 BarChart */}
      {trendData?.stackoverflow_survey?.length > 0 && (
        <div className="trend-list">
          <h2 className="summary-title">Stack Overflow 설문 결과</h2>
          <p className="chart-description">
            개발자들이 사랑하고(💜), 사용하는(🛠️), 배우고 싶은(📚) 기술의 비율을 나타냅니다.
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData.stackoverflow_survey}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="technology" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const labelMap = {
                    loved: '💜 사랑받는 기술',
                    usage: '🛠️ 사용하는 기술',
                    wanted: '📚 배우고 싶은 기술',
                  };
                  return [value, labelMap[name] || name];
                }}
              />
              <Bar dataKey="loved" fill="#8884d8" name="💜 사랑받는 기술"/>
              <Bar dataKey="usage" fill="#82ca9d" name="🛠️ 많이 사용하는 기술"/>
              <Bar dataKey="wanted" fill="#ffc658" name="📚 배우고 싶은 기술"/>
            </BarChart>
          </ResponsiveContainer>

          {/* ✅ 범례를 차트 밖에서 수동 구현 */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
            <span style={{ color: '#8884d8', fontWeight: 500 }}>💜 사랑받는 기술</span>
            <span style={{ color: '#82ca9d', fontWeight: 500 }}>🛠️ 많이 사용하는 기술</span>
            <span style={{ color: '#ffc658', fontWeight: 500 }}>📚 배우고 싶은 기술</span>
          </div>
        </div>
      )}

      {/* ✅ 로딩 or 에러 */}
      {!isLoading && !trendData && <p>📭 데이터를 불러오지 못했습니다.</p>}
      {isLoading && <p>📡 로딩 중...</p>}
    </div>
  );
};

export default TechTrendDashboard;
