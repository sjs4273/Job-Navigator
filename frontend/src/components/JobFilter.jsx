import { useState } from 'react';
import { Box } from '@mui/material';
import '../pages/JobsPage.css';

const FILTER_KEYS = ['직무유형', '지역', '경력'];

const FILTER_OPTIONS = {
  직무유형: [
    { label: '전체', value: '' },
    { label: '프론트엔드', value: 'frontend' },
    { label: '백엔드', value: 'backend' },
    { label: '모바일', value: 'mobile' },
    { label: '데이터', value: 'data' },
  ],
  지역: [
    { label: '전체', value: '' },
    ...[
      '서울',
      '경기',
      '인천',
      '대전',
      '부산',
      '광주',
      '대구',
      '울산',
      '세종',
      '강원',
      '충북',
      '충남',
      '전북',
      '전남',
      '경북',
      '경남',
      '제주',
    ].map((region) => ({ label: region, value: region })),
  ],
  경력: [
    { label: '전체', value: '무관' },
    { label: '신입 포함', value: '신입 포함' },
    { label: '1년 이상', value: '1년 이상' },
    { label: '3년 이상', value: '3년 이상' },
    { label: '5년 이상', value: '5년 이상' },
    { label: '10년 이상', value: '10년 이상' },
  ],
};

// ✅ 기술스택 매핑 (직무유형 → 기술 목록)
const JOB_TYPE_TECH_STACK = {
  프론트엔드: ['React', , 'TypeScript', 'Tailwind', 'Next.js', 'Flutter'],
  백엔드: ['Node.js', 'Python', 'Java', 'JavaScript', 'C', 'Git', 'Docker'],
  모바일: ['Swift', 'Kotlin', 'REST API', 'Flutter', 'iOS', 'Android'],
  데이터: ['NLP', 'SQL', 'PyTorch', 'Linux', 'AWS', 'OpenCV', 'C'],
};

const keyMap = {
  직무유형: 'job_type',
  지역: 'location',
  경력: 'experience',
};

const JobFilter = ({ filters, onChange }) => {
  const [activeTab, setActiveTab] = useState('직무유형');

  const handleSelect = (category, value) => {
    const key = keyMap[category];
    const current = filters[key];

    const updated = {
      ...filters,
      [key]: current === value ? '' : value, // 토글
    };

    // 기술스택 초기화 (직무유형 바꿀 때만)
    if (category === '직무유형') {
      updated.tech_stack = '';
    }

    onChange(updated);
  };

  return (
    <Box sx={{ mb: 3, ml: { xs: 0, sm: 10 }, minHeight: '100px' }}>
      {/* 상단 탭 */}
      <div className="filter-tab-wrapper top-tab">
        {FILTER_KEYS.map((key) => (
          <button
            key={key}
            className={`pill ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {key}
          </button>
        ))}
      </div>

      {/* 선택된 필터 옵션 */}
      {activeTab && (
        <>
          <div className="filter-option-wrapper">
            {FILTER_OPTIONS[activeTab].map(({ label, value }) => {
              const key = keyMap[activeTab];
              const isActive = filters[key] === value;
              return (
                <button
                  key={value || 'all'}
                  className={`pill ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelect(activeTab, value)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* ✅ 직무유형이 선택된 경우 → 해당 기술스택 보여주기 */}
          {activeTab === '직무유형' &&
            FILTER_OPTIONS['직무유형']
              .filter(({ value }) => value && filters.job_type === value)
              .map(({ label }) => (
                <div className="filter-option-wrapper" key={label}>
                  {JOB_TYPE_TECH_STACK[label]?.map((tech) => {
                    const isActive = filters.tech_stack === tech;
                    return (
                      <button
                        key={tech}
                        className={`pill ${isActive ? 'active' : ''}`}
                        onClick={() =>
                          onChange({
                            ...filters,
                            tech_stack: isActive ? '' : tech,
                          })
                        }
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              ))}
        </>
      )}
    </Box>
  );
};

export default JobFilter;
