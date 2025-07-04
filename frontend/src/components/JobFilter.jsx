import { useState } from 'react';
import { Box, Chip, Stack } from '@mui/material';
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
  지역: [{ label: '전체', value: '' }, 
    ...['서울','경기','인천','대전','부산','광주','대구','울산','세종','강원','충북','충남','전북','전남','경북','경남','제주'].map(region => ({ label: region, value: region }))],
  경력: [
    { label: '전체', value: '무관' },
    { label: '신입 포함', value: '신입 포함' },
    { label: '1년 이상', value: '1년 이상' },
    { label: '3년 이상', value: '3년 이상' },
    { label: '5년 이상', value: '5년 이상' },
    { label: '10년 이상', value: '10년 이상' },
  ],
};

const JOB_TYPE_TECH_STACK = {
  프론트엔드: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Flutter', 'Vue.js', 'HTML', 'CSS', 'Git'],
  백엔드: ['Node.js', 'Python', 'Java', 'Spring Boot', 'JavaScript', 'PHP', 'C', 'Git', 'Docker'],
  모바일: ['Swift', 'Kotlin', 'REST API', 'Flutter', 'iOS', 'Android', 'Objective-C'],
  데이터: ['NLP', 'SQL', 'PyTorch', 'Linux', 'AWS', 'OpenCV', 'TensorFlow'],
};

const keyMap = {
  직무유형: 'job_type',
  지역: 'location',
  경력: 'experience',
};

const JobFilter = ({ filters, onChange }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState([]);

  const handleTabClick = (category) => {
    const key = keyMap[category];
    const isOpen = activeTab === category;

    if (isOpen) {
      const updated = { ...filters, [key]: '' };
      if (category === '직무유형') updated.tech_stack = '';
      setSelectedOrder((prev) =>
        prev.filter((k) => k !== key && k !== 'tech_stack')
      );
      onChange(updated);
      setActiveTab(null);
    } else {
      setActiveTab(category);
    }
  };

  const handleSelect = (category, value) => {
    const key = keyMap[category];
    const isSame = filters[key] === value;

    const updated = {
      ...filters,
      [key]: isSame ? '' : value,
    };
    if (category === '직무유형') updated.tech_stack = '';

    if (!isSame) {
      setSelectedOrder((prev) => (prev.includes(key) ? prev : [...prev, key]));
    } else {
      setSelectedOrder((prev) =>
        prev.filter((k) => k !== key && k !== 'tech_stack')
      );
    }

    onChange(updated);
  };

  const handleDelete = (key) => {
    const updated = { ...filters, [key]: '' };
    if (key === 'job_type') updated.tech_stack = '';
    setSelectedOrder((prev) =>
      prev.filter((k) => k !== key && k !== 'tech_stack')
    );
    onChange(updated);
  };

  const handleDeleteTech = () => {
    setSelectedOrder((prev) => prev.filter((k) => k !== 'tech_stack'));
    onChange({ ...filters, tech_stack: '' });
  };

  const renderSelectedChips = () => {
    return selectedOrder.map((key) => {
      const value = filters[key];
      if (!value) return null;

      let label = value;
      if (key === 'job_type') {
        label =
          FILTER_OPTIONS['직무유형'].find((opt) => opt.value === value)
            ?.label || value;
      }

      return (
        <Chip
          key={key}
          label={label}
          onDelete={() =>
            key === 'tech_stack' ? handleDeleteTech() : handleDelete(key)
          }
          sx={{ mr: 1, mb: 1 }}
        />
      );
    });
  };

  return (
    <Box sx={{ mb: 3, ml: { xs: 0, sm: 5 } }}>
      {/* 상단 탭 */}
      <div className="filter-tab-wrapper top-tab">
        {FILTER_KEYS.map((key) => {
          const keyName = keyMap[key];
          const isSelected =
            filters[keyName] !== '' ||
            (key === '직무유형' && filters.tech_stack);
          return (
            <button
              key={key}
              className={`pill ${isSelected ? 'active' : ''}`}
              onClick={() => handleTabClick(key)}
            >
              {key}
            </button>
          );
        })}
      </div>

      {/* 🔽 하위 필터 옵션 */}
      {activeTab && (
        <>
          <div
            className="filter-option-wrapper"
            style={{ marginBottom: '12px' }}
          >
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

          {/* 기술스택 필터 */}
          {activeTab === '직무유형' && filters.job_type && (
            <div
              className="filter-option-wrapper"
              style={{ marginBottom: '12px' }}
            >
              {JOB_TYPE_TECH_STACK[
                FILTER_OPTIONS['직무유형'].find(
                  (opt) => opt.value === filters.job_type
                )?.label
              ]?.map((tech) => {
                const isActive = filters.tech_stack === tech;
                return (
                  <button
                    key={tech}
                    className={`pill ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      const updated = {
                        ...filters,
                        tech_stack: isActive ? '' : tech,
                      };

                      setSelectedOrder((prev) =>
                        isActive
                          ? prev.filter((k) => k !== 'tech_stack')
                          : prev.includes('tech_stack')
                            ? prev
                            : [...prev, 'tech_stack']
                      );

                      onChange(updated);
                    }}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
          )}

          {/* 선택된 필터 Chip 출력 */}
          <Stack direction="row" flexWrap="wrap" sx={{ mb: 1, mt: '10px' }}>
            {renderSelectedChips()}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default JobFilter;
