import React, { useState, useRef } from 'react';
import './ResumeAnalysisPage.css';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // ✅ 업로드 완료 아이콘 추가

export default function ResumeAnalysisPage() {
  // ✅ 페이지 이동용 훅
  const navigate = useNavigate();

  // ✅ 업로드할 PDF 파일 객체 상태
  const [pdfFile, setPdfFile] = useState(null);
  // ✅ 선택된 파일 이름 상태
  const [selectedFileName, setSelectedFileName] = useState('');
  // ✅ 드래그 상태 여부
  const [dragOver, setDragOver] = useState(false);
  // ✅ input 엘리먼트를 제어하기 위한 ref
  const fileInputRef = useRef(null);

  // ✅ 파일 선택 시 실행되는 함수 (클릭 or 드래그 후 drop)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file); // 선택된 파일 저장
      setSelectedFileName(file.name); // 파일 이름 저장
    }
  };

  // ✅ 드래그 영역에 파일이 올라올 때 실행
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true); // 드래그 상태 true
  };

  // ✅ 드래그 영역에서 벗어날 때 실행
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false); // 드래그 상태 false
  };

  // ✅ 파일을 드래그 영역에 놓았을 때 실행
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false); // 드래그 상태 false
    const file = e.dataTransfer.files[0];
    if (file) {
      setPdfFile(file); // 선택된 파일 저장
      setSelectedFileName(file.name); // 파일 이름 저장
    }
  };

  // ✅ PDF 업로드 및 분석 요청 함수
  const uploadPDF = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login'); // 로그인 페이지로 이동
      return;
    }

    if (!pdfFile) {
      alert('PDF 파일을 선택해주세요!');
      return;
    }

    const formData = new FormData();
    formData.append('pdf_file', pdfFile); // FormData에 파일 추가

    try {
      const response = await fetch('http://localhost:8000/api/v1/resume/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰 추가
        },
        body: formData,
      });

      if (!response.ok) throw new Error('서버 오류');

      const result = await response.json();
      console.log('✅ 분석 결과:', result);

      // 결과 페이지로 이동하면서 분석 데이터 전달
      navigate('/roadmap', { state: { analysisResult: result } });
    } catch (error) {
      console.error('❌ 요청 중 오류:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      {/* ✅ 상단 탭 및 분석 시작 버튼 */}
      <div className="analysis-top-bar">
        <div className="analysis-tab-group">
          {/* 현재 페이지 (PDF 분석) */}
          <button type="button" className="analysis-tab active">
            PDF분석
          </button>
          {/* 다른 페이지 (직무 분석) */}
          <button
            type="button"
            className="analysis-tab"
            onClick={() => navigate('/analysis')}
          >
            직무분석
          </button>
        </div>
        <button
          type="button"
          className="analysis-analyze-btn"
          onClick={uploadPDF}
        >
          분석시작
        </button>
      </div>

      {/* ✅ PDF 업로드 영역 */}
      <section className="analysis-section">
        <div className="resume-input-button-row">
          <div
            className={`resume-drop-area ${dragOver ? 'drag-over' : ''} ${selectedFileName ? 'uploaded' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* 파일이 선택된 경우: 아이콘 + 파일명 + 메시지 */}
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
              // 파일이 없으면 안내 문구
              <>
                <p className="large-text">
                  업로드할 PDF 파일을
                  <br />
                  올려주세요
                </p>
              </>
            )}
            {/* 숨겨진 input (파일 선택) */}
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
