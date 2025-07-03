import React, { useState, useRef } from 'react';
import './ResumeAnalysisPage.css';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import AnalysisTopBar from '../components/AnalysisTopBar';

// ✅ ResumeAnalysisPage 컴포넌트 정의
export default function ResumeAnalysisPage() {
  // 🚩 페이지 이동 훅
  const navigate = useNavigate();

  // 🚩 PDF 파일 객체 상태
  const [pdfFile, setPdfFile] = useState(null);
  // 🚩 선택된 파일명 상태
  const [selectedFileName, setSelectedFileName] = useState('');
  // 🚩 드래그 상태 표시용
  const [dragOver, setDragOver] = useState(false);
  // 🚩 숨겨진 input 엘리먼트를 위한 ref
  const fileInputRef = useRef(null);

  // ✅ 파일 선택 시 (클릭 or drop 후 input change)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setSelectedFileName(file.name);
    }
  };

  // ✅ 드래그 중일 때 상태 변경
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  // ✅ 드래그가 영역을 떠날 때 상태 초기화
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // ✅ 파일을 drop 했을 때 실행
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setPdfFile(file);
      setSelectedFileName(file.name);
    }
  };

  // ✅ PDF 파일 업로드 및 분석 요청 함수
  const uploadPDF = async () => {
    const token = localStorage.getItem('access_token');

    // 로그인이 안 된 경우 알림 후 이동
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 파일이 선택되지 않은 경우 알림
    if (!pdfFile) {
      alert('PDF 파일을 선택해주세요!');
      return;
    }

    const formData = new FormData();
    formData.append('pdf_file', pdfFile);

    try {
      const response = await fetch('http://localhost:8000/api/v1/resume/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error('서버 오류');

      const result = await response.json();

      // 분석 결과 페이지로 이동하며 데이터 전달
      navigate('/roadmap', { state: { analysisResult: result } });
    } catch (error) {
      console.error(error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      {/* ✅ 상단 탭 + 분석 버튼 공통 컴포넌트 */}
      <AnalysisTopBar activeTab="pdf" onAnalyzeClick={uploadPDF} />

      {/* ✅ PDF 파일 업로드 영역 */}
      <section className="analysis-section">
        <div className="resume-input-button-row">
          <div
            className={`resume-drop-area ${dragOver ? 'drag-over' : ''} ${selectedFileName ? 'uploaded' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* ✅ 파일이 선택된 경우: 아이콘 + 파일명 + 안내 문구 표시 */}
            {selectedFileName ? (
              <>
                <FaCheckCircle
                  size={48}
                  color="#22c55e"
                  style={{ marginBottom: '4px' }}
                />
                <div style={{ marginTop: '8px', fontWeight: '600' }}>
                  {selectedFileName}
                </div>
                <p className="file-uploaded-msg">
                  ✅ 파일이 업로드 준비되었습니다!
                </p>
              </>
            ) : (
              // ✅ 파일이 선택되지 않은 경우 안내 문구
              <p className="large-text">
                업로드할 PDF 파일을
                <br />
                올려주세요
              </p>
            )}

            {/* ✅ 숨겨진 파일 input: 클릭 또는 영역 클릭 시 동작 */}
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
    </div>
  );
}
