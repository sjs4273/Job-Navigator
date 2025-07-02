import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import { Box, Grid, Paper, Typography } from '@mui/material';

const LearningRoadmap = ({
  roadmapData = [],
  resourcesData = [],
  totalPeriod = '3개월',
  skillCount = 0,
  improvementRate = 0
}) => {
  const getColorByPriority = (priority) => {
    return priority === '높음' ? '#3b82f6' : '#10b981';
  };

  // 🔄 추천 리소스를 각 단계에 병합
  const enrichedRoadmap = roadmapData.map((phase) => {
    const phaseKey = phase.phase.split(' ')[0]; // '1단계 (1-2개월)' → '1단계'
    const matched = resourcesData.find((res) => res.phase === phaseKey);
    return {
      ...phase,
      resources: matched?.resources || [],
    };
  });

  return (
    <div style={{ background: '#f9fafb', padding: '40px 20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 'bold', fontSize: '1.75rem' }}>
        커리어 로드맵
      </h2>

      {Array.isArray(enrichedRoadmap) && enrichedRoadmap.length > 0 ? (
        <VerticalTimeline lineColor="#3b82f6">
          {enrichedRoadmap.map((phase, index) => (
            <VerticalTimelineElement
              key={index}
              date={phase.phase}
              iconStyle={{
                background: getColorByPriority(phase.priority),
                color: '#fff'
              }}
              icon={<BookOpen size={20} />}
              contentStyle={{
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
              contentArrowStyle={{ borderRight: '7px solid #ffffff' }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{phase.description}</h3>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: '#475569' }}>
                🔧 학습 기술: {(phase.skills || []).join(', ')}
              </p>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: '#475569' }}>
                💡 우선순위: <strong>{phase.priority}</strong> | 난이도: <strong>{phase.difficulty}</strong>
              </p>
              <p style={{ fontWeight: 500, marginTop: '1rem', marginBottom: '0.3rem' }}>
                📚 추천 학습 자료
              </p>
              <ul style={{ paddingLeft: '1.2rem', color: '#334155', marginBottom: 0 }}>
                {(phase.resources || []).map((res, i) => (
                  <li key={i} style={{ fontSize: '0.9rem' }}>{res}</li>
                ))}
              </ul>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      ) : (
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          로드맵 데이터가 존재하지 않습니다.
        </Typography>
      )}

      {/* ✅ 로드맵 완료 시 예상 결과 */}
      <Box mt={6}>
        <Typography variant="h6" textAlign="center" fontWeight={600} mb={3}>
          로드맵 완료 시 예상 결과
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Paper sx={{ bgcolor: '#eff6ff', p: 3, textAlign: 'center' }}>
              <Clock color="#3b82f6" size={32} />
              <Typography variant="subtitle2" mt={1}>학습 기간</Typography>
              <Typography variant="h5" fontWeight={700} color="primary">{totalPeriod}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ bgcolor: '#ecfdf5', p: 3, textAlign: 'center' }}>
              <BookOpen color="#10b981" size={32} />
              <Typography variant="subtitle2" mt={1}>신규 기술</Typography>
              <Typography variant="h5" fontWeight={700} color="success.main">{skillCount}개</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ bgcolor: '#f5f3ff', p: 3, textAlign: 'center' }}>
              <TrendingUp color="#8b5cf6" size={32} />
              <Typography variant="subtitle2" mt={1}>적합도 향상</Typography>
              <Typography variant="h5" fontWeight={700} color="secondary.main">+{improvementRate}%</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default LearningRoadmap;
