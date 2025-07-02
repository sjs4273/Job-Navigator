import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Stack,
  Paper
} from '@mui/material';
import { Award, AlertTriangle, Target } from 'lucide-react';

const SkillGapAnalysis = ({ data, insights, userProfile }) => {
  const {
    matchingRate,
    userSkills,
    marketDemandSkills,
    missingSkills
  } = data;

  const {
    strengths,
    weaknesses
  } = insights;

  const userSkillSet = new Set(userSkills);

  return (
    <Stack spacing={4}>
      {/* ✅ 매칭률 */}
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">시장 요구사항 매칭률</Typography>
            <Typography variant="h5" color="primary">{matchingRate}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={matchingRate} />
          <Typography variant="body2" color="text.secondary" mt={2}>
            {`${userProfile?.targetField ?? '지원 직무'} 기준 스킬 적합도`}
          </Typography>
        </CardContent>
      </Card>

      {/* ✅ 주요 강점 */}
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Award size={20} style={{ color: '#16a34a', marginRight: 8 }} />
            <Typography fontWeight={600}>주요 강점</Typography>
          </Box>
          <Stack spacing={2}>
            {strengths.map((s, i) => (
              <Paper key={i} sx={{ p: 2, backgroundColor: '#ecfdf5' }}>
                <Typography fontWeight={500} color="success.main">{s.title}</Typography>
                <Typography variant="body2" color="success.dark">{s.desc}</Typography>
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* ✅ 개선 필요 영역 */}
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <AlertTriangle size={20} style={{ color: '#ea580c', marginRight: 8 }} />
            <Typography fontWeight={600}>개선 필요 영역</Typography>
          </Box>
          <Stack spacing={2}>
            {weaknesses.map((w, i) => (
              <Paper key={i} sx={{ p: 2, backgroundColor: '#fff7ed' }}>
                <Typography fontWeight={500} color="warning.main">{w.title}</Typography>
                <Typography variant="body2" color="warning.dark">{w.desc}</Typography>
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* ✅ 보유 기술 스택 */}
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Award size={20} style={{ color: '#16a34a', marginRight: 8 }} />
            <Typography fontWeight={600}>보유 기술 스택</Typography>
          </Box>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {userSkills.map((skill, index) => (
              <Chip key={index} label={skill} color="success" variant="outlined" />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* ✅ 시장 요구 기술 */}
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Target size={20} style={{ color: '#2563eb', marginRight: 8 }} />
            <Typography fontWeight={600}>시장 요구 기술</Typography>
          </Box>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {marketDemandSkills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                variant="outlined"
                color={userSkillSet.has(skill) ? 'success' : 'error'}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* ✅ 학습 우선순위 */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" mb={2}>학습 우선순위 기술</Typography>
          <Stack spacing={2}>
            {missingSkills.map((item, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f9fafb'
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontWeight={500}>{item.skill}</Typography>
                  <Chip
                    size="small"
                    label={item.priority}
                    color={item.priority === '높음' ? 'error' : 'warning'}
                    variant="outlined"
                  />
                </Box>
                <Box textAlign="right">
                  <Typography fontWeight={500}>수요율: {item.demandRate}%</Typography>
                  <Typography variant="caption" color="text.secondary">{item.reason}</Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default SkillGapAnalysis;
