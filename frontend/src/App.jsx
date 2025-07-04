// 📄 파일명: src/App.jsx

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import Jobs from './pages/JobsPage';
import TrendPage from './pages/TrendPage';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import Header from './components/Header';
import MyPage from './pages/MyPage';
import Footer from './components/Footer'; // ✅ Footer 컴포넌트 import
import ResumeAnalysisDashboard from './pages/ResumeAnalysisDashboard';
import ResumeAnalysisLoadingDemo from './pages/ResumeAnalysisLoadingDemo';
import SocialLoginRedirectHandler from './pages/SocialLoginRedirectHandler';
import './global.css';


function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <Header userInfo={userInfo} setUserInfo={setUserInfo} />
      <Routes>
       
        <Route path="/" element={<MainPage userInfo={userInfo} setUserInfo={setUserInfo} />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/trend" element={<TrendPage />} />
        <Route path="/resume" element={<ResumeAnalysisPage />} />
        {/* ✅ 분석된 이력서 상세 결과 대시보드 */}
        <Route path="/resume-analysis/:resumeId" element={<ResumeAnalysisDashboard />} />

        {/* ✅ 마이페이지 - 이미지 변경 시 userInfo 즉시 반영 */}
        <Route path="/mypage" element={<MyPage userInfo={userInfo} setUserInfo={setUserInfo} />} />
        <Route path="/resume-loading-demo" element={<ResumeAnalysisLoadingDemo />} />
        <Route path="/login" element={<SocialLoginRedirectHandler setUserInfo={setUserInfo} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
