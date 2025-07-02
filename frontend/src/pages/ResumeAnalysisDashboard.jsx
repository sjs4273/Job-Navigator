import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import axios from 'axios';

import ResumeHeader from '../components/ResumeHeader';
import InsightCards from '../components/InsightCards';
import TabNavigation from '../components/TabNavigation';
import SkillGapAnalysis from '../components/SkillGapAnalysis';
import PositionFitAnalysis from '../components/PositionFitAnalysis';
import LearningRoadmap from '../components/LearningRoadmap';

const ResumeAnalysisDashboard = () => {
  const [activeTab, setActiveTab] = useState('skill-gap');
  const [gptData, setGptData] = useState(null);
  const [loading, setLoading] = useState(true);

  const resumeId = 7; // 🧠 테스트용 resume_id 하드코딩

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/resume/${resumeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const parsedData = typeof response.data.gpt_response === 'string'
          ? JSON.parse(response.data.gpt_response)
          : response.data.gpt_response;

        setGptData(parsedData);
      } catch (error) {
        console.error('❌ GPT 분석 결과 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (loading) return <Box sx={{ p: 4 }}>로딩 중...</Box>;
  if (!gptData || Object.keys(gptData).length === 0 || !gptData.userProfile) {
    return <Box sx={{ p: 4 }}>분석 결과가 없습니다.</Box>;
  }

  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <ResumeHeader userProfile={gptData.userProfile} />
        <InsightCards keyInsights={gptData.keyInsights ?? {}} />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <Box sx={{ mt: 2 }}>
          {activeTab === 'skill-gap' && gptData.skillGapData && (
            <SkillGapAnalysis
              data={gptData.skillGapData}
              insights={gptData.strengthsAndWeaknesses ?? { strengths: [], weaknesses: [] }}
              userProfile={gptData.userProfile} // ✅ 추가된 부분
            />
          )}
          {activeTab === 'position-fit' &&
            gptData.positionFitData &&
            gptData.difficultyData &&
            gptData.radarData && (
              <PositionFitAnalysis
                positionFitData={gptData.positionFitData}
                difficultyData={gptData.difficultyData}
                radarData={gptData.radarData}
                insights={gptData.radarInsights}
               />
            )}
          {activeTab === 'roadmap' &&
            Array.isArray(gptData.learningRoadmap) &&
            Array.isArray(gptData.recommendedResources) && (
              <LearningRoadmap
                roadmapData={gptData.learningRoadmap}
                resourcesData={gptData.recommendedResources}
                totalPeriod={
                    gptData.learningRoadmap?.length > 0
                    ? gptData.learningRoadmap[gptData.learningRoadmap.length - 1].phase.match(/\((.*?)\)/)?.[1] || '6개월'
                    : '6개월'
                }
                skillCount={gptData.learningRoadmap.reduce((acc, cur) => acc + cur.skills.length, 0)}
                improvementRate={gptData.skillGapData?.matchingRate ?? 0}
              />
            )}
        </Box>
      </Container>
    </Box>
  );
};

export default ResumeAnalysisDashboard;
