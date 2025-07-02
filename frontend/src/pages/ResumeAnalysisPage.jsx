import React, { useState, useRef } from 'react';
import './ResumeAnalysisPage.css';
import { useNavigate } from 'react-router-dom';

export default function ResumeAnalysisPage() {
  const navigate = useNavigate();

  // ✅ PDF 파일 객체를 담는 state
  const [pdfFile, setPdfFile] = useState(null);

  // ✅ 선택된 파일 이름을 표시하기 위한 state
  const [selectedFileName, setSelectedFileName] = useState('');

  // ✅ 드래그 상태 여부 (드래그 중이면 true)
  const [dragOver, setDragOver] = useState(false);

  // ✅ 숨겨진 input 요소에 접근하기 위한 ref
  const fileInputRef = useRef(null);

  // ✅ 파일 선택 시 실행되는 함수 (input을 통한 선택)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file); // 실제 파일 객체를 저장
      setSelectedFileName(file.name); // 파일 이름 표시
    }
  };

  // ✅ 드래그 영역 위에 파일이 올라왔을 때
  const handleDragOver = (e) => {
    e.preventDefault(); // 기본 이벤트 방지
    setDragOver(true); // 드래그 중 상태로 표시
  };

  // ✅ 드래그 영역을 벗어났을 때
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false); // 드래그 상태 해제
  };

  // ✅ 드래그 후 파일이 드롭됐을 때
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false); // 드래그 상태 해제
    const file = e.dataTransfer.files[0];
    if (file) {
      setPdfFile(file); // 실제 파일 객체를 저장
      setSelectedFileName(file.name); // 파일 이름 표시
    }
  };

  // ✅ 박스를 클릭했을 때 숨겨진 input 클릭
  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // input 클릭 이벤트 트리거
    }
  };

  // ✅ 서버로 PDF 업로드하는 함수
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

    // ✅ FormData를 사용해 파일 데이터 준비
    const formData = new FormData();
    formData.append('pdf_file', pdfFile);

    try {
      const response = await fetch('http://localhost:8000/api/v1/resume/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('서버 오류');
      }

      const result = await response.json();
      console.log('✅ 분석 결과:', result);

      // ✅ 결과 페이지로 이동하면서 데이터 전달
      navigate('/roadmap', { state: { analysisResult: result } });
    } catch (error) {
      console.error('❌ 요청 중 오류:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      {/* ✅ 상단 탭 및 버튼 영역 */}
      <div className="analysis-top-bar">
        <div className="analysis-tab-group">
          {/* PDF 분석 탭 (활성화된 상태) */}
          <button type="button" className="analysis-tab active">
            PDF분석
          </button>
          {/* 직무분석 탭 (클릭 시 페이지 이동) */}
          <button
            type="button"
            className="analysis-tab"
            onClick={() => navigate('/analysis')}
          >
            직무분석
          </button>
        </div>
        {/* 분석시작 버튼 */}
        <button
          type="button"
          className="analysis-analyze-btn"
          onClick={uploadPDF}
        >
          분석시작
        </button>
      </div>

      {/* ✅ 분석 영역 (파일 드래그 & 클릭 업로드) */}
      <section className="analysis-section">
        <div className="resume-input-button-row">
          <div
            className={`resume-drop-area ${dragOver ? 'drag-over' : ''}`}
            onClick={handleBoxClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* 파일 이름이 있으면 표시, 없으면 안내 문구 */}
            {selectedFileName ? (
              <span>{selectedFileName}</span>
            ) : (
              <>
                업로드할 pdf파일을
                <br />
                올려주세요
              </>
            )}
            {/* 실제 input 태그 (숨겨져 있음, ref로 연결) */}
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
