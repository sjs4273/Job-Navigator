// 📄 파일명: src/pages/MainPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import ServiceSummarySection from '../components/ServiceSummarySection';

import './MainPage.css';

function MainPage() {
  return (
    <div className="main-container">
      {/* 이미지 섹션 */}
      <section className="image-section">
        <div className="image-container">
          <img src="/main_person1.png" alt="일러스트1" />
          <img src="/main_person2.png" alt="일러스트2" />
          <img src="/main_person3.png" alt="일러스트3" />
          <img src="/main_person4.png" alt="일러스트4" />
        </div>
      </section>

      {/* 메시지 섹션 */}
      <section className="message-section">
        <h2>개발자들 요즘머함?</h2>
        <p>
          🔍 개인 맞춤 이력서 분석이 필요하신가요? <br className="mobile-break" />
         로그인하여 바로 확인해보세요!
        </p>
        <Button
          className="shake-button"
          component={Link}
          to="/resume"
          variant="contained"
          sx={{
            mt: 4,
            backgroundColor: '#3a82f7',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1rem',
            px: 4,
            py: 1.5,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#5a6fd3',
            },
          }}
        >
          취업 가능한지 알려드림 →
        </Button>

        {/* ✅ 아래로 스크롤 유도 */}
        <div className="scroll-indicator">
          <p className="scroll-text">아래로 스크롤</p>
          <div className="scroll-arrow">▼</div>
        </div>
      </section>

      <ServiceSummarySection />
    </div>
  );
}

export default MainPage;
