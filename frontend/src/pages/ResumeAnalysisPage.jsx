import React, { useState, useRef } from 'react';
import './ResumeAnalysisPage.css';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import AnalysisTopBar from '../components/AnalysisTopBar';
import { CircularProgress, Box } from '@mui/material'; // ✅ MUI 스피너 추가

export default function ResumeAnalysisPage() {
  const navigate = useNavigate();

  const [pdfFile, setPdfFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ 로딩 상태 추가
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setSelectedFileName(file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setPdfFile(file);
      setSelectedFileName(file.name);
    }
  };

  // ✅ PDF 업로드 + GPT 분석 + 대시보드 이동
  const uploadPDF = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!pdfFile) {
      alert('PDF 파일을 선택해주세요!');
      return;
    }

    const formData = new FormData();
    formData.append('pdf_file', pdfFile);

    setLoading(true); // ✅ 로딩 시작
    try {
      const uploadRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/resume/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('파일 업로드 실패');
      const resume = await uploadRes.json();
      const resumeId = resume.resume_id;

      const analyzeRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/resume/${resumeId}/analysis`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!analyzeRes.ok) throw new Error('GPT 분석 실패');

      navigate(`/resume-analysis/${resumeId}`);
    } catch (error) {
      console.error('❌ 분석 실패:', error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false); // ✅ 로딩 종료
    }
  };

  return (
    <div>
      {/* ✅ 상단 탭 및 분석 버튼 */}
      <AnalysisTopBar activeTab="pdf" onAnalyzeClick={uploadPDF} />

      {/* ✅ 로딩 중일 경우 스피너 표시 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh' }}>
          <CircularProgress />
          <span style={{ marginLeft: '12px', fontSize: '16px' }}>분석 중입니다...</span>
        </Box>
      ) : (
        <section className="analysis-section">
          <div className="resume-input-button-row">
            <div
              className={`resume-drop-area ${dragOver ? 'drag-over' : ''} ${selectedFileName ? 'uploaded' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedFileName ? (
                <>
                  <FaCheckCircle size={48} color="#22c55e" style={{ marginBottom: '4px' }} />
                  <div style={{ marginTop: '8px', fontWeight: '600' }}>{selectedFileName}</div>
                  <p className="file-uploaded-msg">✅ 파일이 업로드 준비되었습니다!</p>
                </>
              ) : (
                <p className="large-text">
                  업로드할 PDF 파일을
                  <br />
                  올려주세요
                </p>
              )}

              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                className="resume-square-input"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
