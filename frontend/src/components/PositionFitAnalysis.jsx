// components/PositionFitAnalysis.jsx

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
  Chip,
  Paper
} from '@mui/material';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';

const PositionFitAnalysis = ({ positionFitData, difficultyData, radarData, insights }) => {
  return (
    <Stack spacing={4}>
      {/* 포지션 적합도 분석 */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>포지션별 적합도 분석</Typography>
          <Stack spacing={2}>
            {positionFitData.map((item, idx) => (
              <Box key={idx}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight="medium">{item.position}</Typography>
                    {item.compatibility >= 70 && (
                      <Chip label="추천" size="small" sx={{ bgcolor: '#bbf7d0', color: '#166534' }} />
                    )}
                  </Box>
                  <Box display="flex" gap={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary">채용공고 {item.openings}개</Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">{item.compatibility}%</Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.compatibility}
                  sx={{
                    mt: 1,
                    height: 8,
                    borderRadius: 2,
                    bgcolor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      bgcolor:
                        item.compatibility >= 70
                          ? '#22c55e'
                          : item.compatibility >= 50
                          ? '#3b82f6'
                          : '#9ca3af'
                    }
                  }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* 분야별 진입 난이도 */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>분야별 진입 난이도</Typography>
          <Stack spacing={2}>
            {difficultyData.map((item, idx) => (
              <Paper key={idx} sx={{ p: 2, bgcolor: '#f9fafb' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography fontWeight={500}>{item.field}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box display="flex" gap={0.3}>
                      {[...Array(10)].map((_, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 6,
                            height: 24,
                            borderRadius: 1,
                            bgcolor: i < item.score ? item.color : '#e5e7eb'
                          }}
                        />
                      ))}
                    </Box>
                    <Typography fontWeight={600}>{item.score}/10</Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* 레이더 차트 */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>현재 vs 시장 요구 스킬 레벨</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
              <Radar name="현재 레벨" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
              <Radar name="시장 요구 레벨" dataKey="required" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>

          {/* 강점/약점 설명 */}
          <Box mt={2}>
            {insights?.currentStrengths && (
                <Typography variant="body2" color="text.secondary">
                • 현재 강점: {insights.currentStrengths}
                </Typography>
            )}
            {insights?.improvementAreas && (
                <Typography variant="body2" color="text.secondary">
                • 보완 필요: {insights.improvementAreas}
                </Typography>
            )}
         </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default PositionFitAnalysis;
