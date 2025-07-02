import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import {
  FaRocket,
  FaCode,
  FaTools,
  FaProjectDiagram,
  FaUserTie,
} from 'react-icons/fa';
import { roadmapData } from '../mock/pdfroadmapmock';
import './PDFRoadmapPage.css';

export default function PDFRoadmapPage() {
  const iconMap = {
    code: <FaCode />,
    tools: <FaTools />,
    project: <FaProjectDiagram />,
    rocket: <FaRocket />,
    tie: <FaUserTie />,
  };

  const handleSave = () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const roadmapDataToSave = roadmapData.map((step) => ({
      title: step.title,
      description: step.description,
    }));

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      alert('userInfo가 없습니다. 먼저 로그인해주세요.');
      return;
    }

    const newRoadmap = {
      date: new Date().toISOString(),
      steps: roadmapDataToSave,
    };

    const updatedUserInfo = {
      ...userInfo,
      roadmaps: [...(userInfo.roadmaps || []), newRoadmap],
    };

    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

    alert('새로운 로드맵이 프로필에 저장되었습니다!');
  };

  return (
    <div>
      <h2 className="roadmap-title">🚀 커리어 로드맵</h2>
      <VerticalTimeline>
        {roadmapData.map((step, index) => (
          <VerticalTimelineElement
            key={index}
            contentStyle={{ background: '#f0f0f0', color: '#333' }}
            contentArrowStyle={{ borderRight: '7px solid #f0f0f0' }}
            iconStyle={{ background: '#0d6efd', color: '#fff' }}
            icon={iconMap[step.iconKey]} // ✅ iconKey에 따라 JSX 렌더링
          >
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>

      <button className="roadmap-save-btn" onClick={handleSave}>
        로드맵 저장하기
      </button>
    </div>
  );
}
