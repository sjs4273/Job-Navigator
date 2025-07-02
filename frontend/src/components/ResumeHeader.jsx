// 📄 components/ResumeHeader.jsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper
} from '@mui/material';

const ResumeHeader = ({ userProfile = {} }) => {
  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          {/* 사용자 기본 정보 */}
          <Box>
            <Typography variant="h5" fontWeight="bold">이력서 분석 결과</Typography>
            <Typography variant="body1" color="text.secondary" mt={0.5}>
              {userProfile.name || "이름 없음"} • {userProfile.experience || "-"} • {userProfile.currentField || "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {userProfile.education || "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userProfile.training || "-"}
            </Typography>
          </Box>

          {/* 종합 평가 */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: '#dbeafe',
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
              mt: { xs: 2, md: 0 },
              minWidth: 100
            }}
          >
            <Typography variant="body2" color="primary">종합 평가</Typography>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {userProfile.overallGrade || "-"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {userProfile.gradeDescription || "분석 결과 없음"}
            </Typography>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResumeHeader;
