import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  TextField,
} from '@mui/material';
import './Jobanalysispage.css';

// ✅ 메인 Analysis 컴포넌트 정의
function Analysis() {
  const navigate = useNavigate();

  // 🚩 선택된 직군 상태
  const [selectedJob, setSelectedJob] = useState('Backend');
  // 🚩 선택된 언어 상태
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  // 🚩 선택된 프레임워크/도구 상태 (여러 개 선택 가능)
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  // 🚩 추가 입력한 기술 상태
  const [extraSkills, setExtraSkills] = useState('');

  // ✅ 언어별 프레임워크/도구 매핑
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

  // ✅ 직군별 선택 가능한 언어 리스트
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

  // ✅ 분석 버튼 클릭 시 호출되는 함수 (API 요청 → 결과 페이지 이동)
  const generateGptRoadmap = async () => {
    if (!selectedLanguage) {
      alert('언어를 선택해주세요!');
      return;
    }

    try {
      // 모든 선택된 기술 통합
      const allSkills = [selectedLanguage, ...selectedFrameworks];
      if (extraSkills.trim() !== '') {
        allSkills.push(extraSkills.trim());
      }

      // API 요청
      const res = await fetch('http://localhost:8000/api/v1/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: selectedJob,
          skills: allSkills,
        }),
      });

      if (!res.ok) throw new Error('서버 응답 오류');

      const result = await res.json();

      // 결과 페이지로 이동
      navigate('/analysis-result', {
        state: {
          result,
          selectedJob,
          selectedSkills: allSkills,
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

  return (
    <div>
      {/* ✅ 상단 탭 메뉴 + 분석 버튼 */}
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

      {/* ✅ 메인 카드 영역 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Card
          sx={{
            width: '600px',
            maxWidth: '90%',
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          <CardContent>
            {/* ✅ 직군 선택 영역 */}
            <Typography variant="h6" sx={{ mt: 1 }} align="center">
              개발 직군
            </Typography>
            <Box className="analysis-button-group">
              {['Backend', 'Frontend', 'Mobile', 'AL/ML'].map((job) => (
                <Button
                  key={job}
                  variant="text"
                  className={selectedJob === job ? 'selected' : ''}
                  onClick={() => {
                    // 직군 변경 시 선택 초기화
                    setSelectedJob(job);
                    setSelectedLanguage(null);
                    setSelectedFrameworks([]);
                    setExtraSkills('');
                  }}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
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

            {/* ✅ 선택된 직군에 따른 언어 선택 영역 */}
            {languagesPerJob[selectedJob] && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="h6"
                  align="center"
                >{`언어 (${selectedJob})`}</Typography>
                <Box className="analysis-button-group">
                  {languagesPerJob[selectedJob].map((lang) => (
                    <Button
                      key={lang}
                      variant="text"
                      className={selectedLanguage === lang ? 'selected' : ''}
                      onClick={() => {
                        // 언어 선택 시 프레임워크 및 추가 입력 초기화
                        setSelectedLanguage(lang);
                        setSelectedFrameworks([]);
                        setExtraSkills('');
                      }}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
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

                {/* ✅ 선택된 언어에 따른 프레임워크 선택 영역 */}
                {selectedLanguage && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      variant="h6"
                      align="center"
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
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                          >
                            {fw}
                          </Button>
                        ))
                      ) : (
                        <Typography sx={{ textAlign: 'center', width: '100%' }}>
                          선택 가능한 프레임워크가 없습니다.
                        </Typography>
                      )}
                    </Box>

                    {/* ✅ 추가 입력 영역 (선택지에 없는 기술, 자격증 등) */}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" align="center">
                      선택지에 없는 기술, 자격증, 스펙
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="예: AWS 자격증, Docker, Kubernetes 등"
                      value={extraSkills}
                      onChange={(e) => setExtraSkills(e.target.value)}
                      helperText="추가적으로 보유한 기술이나 자격증을 입력할 수 있습니다."
                      sx={{ mt: 1 }}
                    />
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default Analysis;
