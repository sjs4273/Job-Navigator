// frontend/src/components/AnalysisTopBar.jsx

import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// ✅ AnalysisTopBar 컴포넌트: 상단 공통 탭과 분석 시작 버튼
export default function AnalysisTopBar({ activeTab, onAnalyzeClick }) {
  // 🚩 페이지 이동을 위한 훅
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between', // 좌우 배치
        alignItems: 'center',
        margin: '0 auto',
        padding: '16px 24px',
        width: 'fit-content',
        minWidth: '650px',
      }}
    >
      {/* ✅ 좌측: PDF 분석 / 직무 분석 탭 버튼 그룹 */}
      <Box sx={{ display: 'flex', gap: '10px' }}>
        {/* PDF 분석 버튼 */}
        <Button
          variant="contained"
          onClick={() => navigate('/resume')} // 클릭 시 PDF 분석 페이지 이동
          sx={{
            backgroundColor: activeTab === 'pdf' ? '#1e90ff' : '#eee', // 선택된 탭 색상
            color: activeTab === 'pdf' ? '#fff' : '#000', // 글자 색
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: activeTab === 'pdf' ? '#1976d2' : '#ddd', // hover 색상
            },
          }}
        >
          PDF 분석
        </Button>

        {/* 직무 분석 버튼 */}
        <Button
          variant="contained"
          onClick={() => navigate('/analysis')} // 클릭 시 직무 분석 페이지 이동
          sx={{
            backgroundColor: activeTab === 'job' ? '#1e90ff' : '#eee',
            color: activeTab === 'job' ? '#fff' : '#000',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: activeTab === 'job' ? '#1976d2' : '#ddd',
            },
          }}
        >
          직무 분석
        </Button>
      </Box>

      {/* ✅ 우측: 분석 시작 버튼 */}
      <Button
        variant="contained"
        onClick={onAnalyzeClick} // 분석 시작 이벤트 핸들러
        sx={{
          padding: '8px 20px',
          backgroundColor: '#000', // 기본 색상
          color: '#fff',
          borderRadius: '4px',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: '#333', // hover 색상
          },
        }}
      >
        분석시작
      </Button>
    </Box>
  );
}
