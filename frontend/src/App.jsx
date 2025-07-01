// 📄 파일명: src/App.jsx

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import Jobs from './pages/JobsPage';
import TrendPage from './pages/TrendPage';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import Header from './components/Header';
import Jobanalysispage from './pages/Jobanalysispage';
import AnalysisResult from './pages/AnalysisResult';
import MyPage from './pages/MyPage';
import RoadmapVisual from './pages/RoadmapVisual';
import PDFRoadmapPage from './pages/PDFRoadmapPage';
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
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage setUserInfo={setUserInfo} />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/trend" element={<TrendPage />} />
        <Route path="/resume" element={<ResumeAnalysisPage />} />
        <Route path="/analysis" element={<Jobanalysispage />} />
        <Route path="/analysis-result" element={<AnalysisResult />} />
        <Route path="/roadmap-visual" element={<RoadmapVisual />} />
        <Route path="/roadmap" element={<PDFRoadmapPage />} />

        {/* 이미지 변경시 헤더이미지 즉시 반영, MyPage에서 setUserInfo() 호출 시 App.jsx의 userInfo 상태가 업데이트}*/}
        <Route path="/mypage" element={<MyPage userInfo={userInfo} setUserInfo={setUserInfo} />} /> 
      </Routes>
    </>
  );
}

export default App;
