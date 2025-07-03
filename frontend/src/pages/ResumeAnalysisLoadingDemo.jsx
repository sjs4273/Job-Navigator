import React from 'react';
import { Box, Typography } from '@mui/material';
import AnimatedStepper from '../components/AnimatedStepper';
import JobIntroCards from '../components/JobIntroCards';

export default function ResumeAnalysisLoadingDemo() {
  return (
    <div>
      <Box sx={{ mt: 15, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          🔍 이력서를 분석하고 있어요...
        </Typography>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          AI가 기술 키워드, 시장 트렌드, 직무 적합도를 기반으로 인사이트를 생성 중입니다.
        </Typography>
      </Box>

      <AnimatedStepper currentStep={3} />
      <JobIntroCards />
    </div>
  );
}
