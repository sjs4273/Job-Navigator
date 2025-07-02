import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import './Jobanalysispage.css';

// ✅ Analysis 컴포넌트 시작
function Analysis() {
  // 🚩 페이지 이동을 위한 React Router의 훅
  const navigate = useNavigate();

  // 🚩 선택한 직무 상태 (초기값: Backend)
  const [selectedJob, setSelectedJob] = useState('Backend');
  // 🚩 선택한 언어 상태
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  // 🚩 선택한 프레임워크/도구 상태 (배열)
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);

  // 🚩 각 언어별 프레임워크/도구 매핑
  const frameworkMap = {
    Python: ['Django', 'Flask', 'FastAPI'],
    Java: ['Spring Boot'],
    'Node.js': ['Express.js', 'NestJS'],
    Ruby: ['Ruby on Rails'],
    Go: ['Gin'],
    Rust: [],
    Kotlin: [],
    TypeScript: [],
    HTML: [],
    CSS: [],
    JavaScript: ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte'],
    Swift: [],
    Dart: ['Flutter'],
    KotlinMobile: ['Android SDK'],
    ReactNativeJS: ['React Native'],
    R: [],
    SQL: [],
    TensorLang: [
      'TensorFlow',
      'PyTorch',
      'Scikit-learn',
      'HuggingFace',
      'LangChain',
    ],
  };

  // 🚩 직무별 언어 리스트
  const languagesPerJob = {
    Backend: [
      'Python',
      'Java',
      'Node.js',
      'Ruby',
      'Go',
      'Rust',
      'Kotlin',
      'TypeScript',
    ],
    Frontend: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
    Mobile: ['Swift', 'Dart', 'KotlinMobile', 'ReactNativeJS'],
    'AL/ML': ['Python', 'R', 'SQL', 'TensorLang'],
  };

  // ✅ 분석 시작 버튼 클릭 시 호출되는 함수
  const generateGptRoadmap = async () => {
    // 언어 선택 여부 검증
    if (!selectedLanguage) {
      alert('언어를 선택해주세요!');
      return;
    }

    try {
      // 백엔드 API에 POST 요청 보내기
      const res = await fetch('http://localhost:8000/api/v1/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: selectedJob,
          skills: [selectedLanguage, ...selectedFrameworks],
        }),
      });

      if (!res.ok) throw new Error('서버 응답 오류');

      // 응답 JSON 파싱
      const result = await res.json();

      // 결과 페이지로 이동하면서 state에 데이터 전달
      navigate('/analysis-result', {
        state: {
          result,
          selectedJob,
          selectedSkills: [selectedLanguage, ...selectedFrameworks],
        },
      });
    } catch (error) {
      alert('분석 중 오류가 발생했습니다.');
    }
  };

  // ✅ 프레임워크 선택/해제 토글 함수
  const toggleFramework = (fw) => {
    setSelectedFrameworks((prev) =>
      prev.includes(fw) ? prev.filter((f) => f !== fw) : [...prev, fw]
    );
  };

  // ✅ 실제 렌더링 시작
  return (
    <div>
      {/* 상단 탭 바 및 분석 버튼 */}
      <div className="analysis-top-bar">
        <div className="analysis-tab-group">
          <button className="analysis-tab" onClick={() => navigate('/resume')}>
            PDF분석
          </button>
          <button className="analysis-tab active">직무분석</button>
        </div>
        <button className="analysis-analyze-btn" onClick={generateGptRoadmap}>
          분석시작
        </button>
      </div>

      {/* 분석 섹션 */}
      <section className="analysis-section">
        {/* 직군 선택 */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          개발 직군
        </Typography>
        <Box className="analysis-button-group">
          {['Backend', 'Frontend', 'Mobile', 'AL/ML'].map((job) => (
            <Button
              key={job}
              variant="text"
              className={selectedJob === job ? 'selected' : ''}
              onClick={() => {
                // 직무 변경 시, 언어와 프레임워크 초기화
                setSelectedJob(job);
                setSelectedLanguage(null);
                setSelectedFrameworks([]);
              }}
            >
              {job === 'Backend'
                ? '백엔드'
                : job === 'Frontend'
                  ? '프론트엔드'
                  : job === 'Mobile'
                    ? '모바일'
                    : 'AI/ML'}
            </Button>
          ))}
        </Box>

        {/* 언어 선택 */}
        {languagesPerJob[selectedJob] && (
          <>
            <Typography
              variant="h6"
              sx={{ mt: 3 }}
            >{`언어 (${selectedJob})`}</Typography>
            <Box className="analysis-button-group">
              {languagesPerJob[selectedJob].map((lang) => (
                <Button
                  key={lang}
                  variant="text"
                  className={selectedLanguage === lang ? 'selected' : ''}
                  onClick={() => {
                    // 언어 선택 시, 프레임워크 초기화
                    setSelectedLanguage(lang);
                    setSelectedFrameworks([]);
                  }}
                >
                  {lang === 'KotlinMobile'
                    ? 'Kotlin'
                    : lang === 'ReactNativeJS'
                      ? 'JavaScript'
                      : lang === 'TensorLang'
                        ? 'Python'
                        : lang}
                </Button>
              ))}
            </Box>

            {/* 프레임워크/도구 선택 */}
            {selectedLanguage && (
              <>
                <Typography
                  variant="h6"
                  sx={{ mt: 3 }}
                >{`프레임워크/도구 (${selectedLanguage})`}</Typography>
                <Box className="analysis-button-group">
                  {frameworkMap[selectedLanguage] &&
                  frameworkMap[selectedLanguage].length > 0 ? (
                    frameworkMap[selectedLanguage].map((fw) => (
                      <Button
                        key={fw}
                        variant="text"
                        className={
                          selectedFrameworks.includes(fw) ? 'selected' : ''
                        }
                        onClick={() => toggleFramework(fw)}
                      >
                        {fw}
                      </Button>
                    ))
                  ) : (
                    <Typography sx={{ textAlign: 'center' }}>
                      선택 가능한 프레임워크가 없습니다.
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}

// ✅ Analysis 컴포넌트 export
export default Analysis;
