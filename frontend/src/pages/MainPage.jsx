import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ServiceSummarySection from '../components/ServiceSummarySection';
import LoginModal from '../components/LoginModal';
import './MainPage.css';

function MainPage({ userInfo, setUserInfo }) {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  const handleButtonClick = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/resume');
    } else {
      localStorage.setItem('redirectPath', '/resume');
      setRedirectPath('/resume');
      setLoginOpen(true);
    }
  };

  useEffect(() => {
    const storedRedirect = localStorage.getItem('redirectPath');

    if (userInfo && storedRedirect) {
      navigate(storedRedirect);
      localStorage.removeItem('redirectPath');
      setRedirectPath(null);
    }

    if (userInfo) {
      setLoginOpen(false);
    }
  }, [userInfo, navigate]);

  return (
    <div className="main-container">
      <section className="image-section">
        <div className="image-container">
          <img src="/main_person1.png" alt="일러스트1" />
          <img src="/main_person2.png" alt="일러스트2" />
          <img src="/main_person3.png" alt="일러스트3" />
          <img src="/main_person4.png" alt="일러스트4" />
        </div>
      </section>

      <section className="message-section">
        <h2>개발자들 요즘머함?</h2>
        <p>
          🔍 개인 맞춤 이력서 분석이 필요하신가요?{' '}
          <br className="mobile-break" />
          로그인하여 바로 확인해보세요!
        </p>
        <Button
          className="shake-button"
          onClick={handleButtonClick}
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

        <div className="scroll-indicator">
          <p className="scroll-text">아래로 스크롤</p>
          <div className="scroll-arrow">▼</div>
        </div>
      </section>

      <ServiceSummarySection />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        setUserInfo={setUserInfo}
      />
    </div>
  );
}

export default MainPage;
