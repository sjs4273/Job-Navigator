import { useState } from 'react';
import { Box } from '@mui/material';
import '../pages/JobsPage.css';

const FILTER_KEYS = ['직무유형', '지역', '경력'];

const FILTER_OPTIONS = {
  직무유형: [
    { label: '프론트엔드', value: 'frontend' },
    { label: '백엔드', value: 'backend' },
    { label: '모바일', value: 'mobile' },
    { label: 'AI', value: 'ai' },
    { label: 'ML', value: 'ml' },
    { label: '클라우드', value: 'cloud' },
    { label: '언어', value: 'language' },
    { label: '데이터베이스', value: 'database' },
    { label: '디자인', value: 'design' },
  ],
  지역: [
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
  경력: [
    '무관',
    '신입 포함',
    '1년 이상',
    '3년 이상',
    '5년 이상',
    '10년 이상',
  ].map((exp) => ({ label: exp, value: exp })),
};

const keyMap = {
  직무유형: 'job_type',
  지역: 'location',
  경력: 'experience',
};

const JobFilter = ({ filters, onChange }) => {
  const [activeTab, setActiveTab] = useState('직무유형');;

  const handleSelect = (category, value) => {
    const key = keyMap[category];
    const current = filters[key];

    const updated = {
      ...filters,
      [key]: current === value ? '' : value,
    };

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

      {/* 선택된 항목 */}
      {activeTab && (
        <div className="filter-option-wrapper">
          {FILTER_OPTIONS[activeTab].map(({ label, value }) => {
            const key = keyMap[activeTab];
            const isActive = filters[key] === value;
            return (
              <button
                key={value}
                className={`pill ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(activeTab, value)}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </Box>
  );
};

export default JobFilter;
