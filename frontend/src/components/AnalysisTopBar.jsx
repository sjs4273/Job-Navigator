// frontend/src/components/AnalysisTopBar.jsx

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

// ✅ AnalysisTopBar 컴포넌트: 상단 공통 탭과 분석 시작 버튼
export default function AnalysisTopBar({ activeTab, onAnalyzeClick }) {
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
      {/* ✅ 좌측: PDF 분석 텍스트만 남김 */}
      <Box sx={{ display: 'flex', gap: '10px', marginLeft: '23px' }}>
        <Box
          sx={{
            backgroundColor: activeTab === 'pdf' ? '#1e90ff' : '#eee', // 선택된 탭 색상
            color: activeTab === 'pdf' ? '#fff' : '#000', // 글자 색
            borderRadius: '4px',
            padding: '6px 16px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default', // 클릭 불가능하게
          }}
        >
          PDF 분석
        </Box>
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
