// 📄 components/InsightCards.jsx
import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { Award, Target, BookOpen } from 'lucide-react';

const InsightCards = ({ keyInsights }) => {
  const safeInsights = keyInsights || {};
  const {
    strength = '분석 결과를 불러오는 중입니다.',
    recommendedPosition = '추천 정보를 불러오는 중입니다.',
    priorityLearning = '우선 학습 정보를 불러오는 중입니다.',
  } = safeInsights;

  return (
    <Grid container spacing={2} mb={3}>
      {/* ✅ 강점 카드 */}
      <Grid item xs={12} sm={4}>
        <Card sx={{ backgroundColor: '#ecfdf5', border: '1px solid #bbf7d0' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <Award size={20} color="#10b981" />
              <Typography variant="subtitle1" fontWeight="bold" ml={1} color="#065f46">
                강점
              </Typography>
            </Box>
            <Typography variant="body2" color="#065f46">
              {strength}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* ✅ 추천 포지션 카드 */}
      <Grid item xs={12} sm={4}>
        <Card sx={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <Target size={20} color="#3b82f6" />
              <Typography variant="subtitle1" fontWeight="bold" ml={1} color="#1e40af">
                추천 포지션
              </Typography>
            </Box>
            <Typography variant="body2" color="#1e40af">
              {recommendedPosition}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* ✅ 우선 학습 카드 */}
      <Grid item xs={12} sm={4}>
        <Card sx={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <BookOpen size={20} color="#ea580c" />
              <Typography variant="subtitle1" fontWeight="bold" ml={1} color="#c2410c">
                우선 학습
              </Typography>
            </Box>
            <Typography variant="body2" color="#c2410c">
              {priorityLearning}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default InsightCards;
