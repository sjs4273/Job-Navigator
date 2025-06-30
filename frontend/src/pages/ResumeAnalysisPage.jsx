import React, { useState } from 'react';
import Header from '../components/Header';
import "./ResumeAnalysisPage.css";
import { useNavigate } from 'react-router-dom';

export default function ResumeAnalysisPage() {
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState(null);

  // 직무분석 페이지 이동 (로그인 여부 확인 X)
  const goToJobPage = () => {
    navigate("/analysis");
  };

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  // PDF 업로드 함수
  const uploadPDF = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!pdfFile) {
      alert("PDF 파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await fetch("http://localhost:8000/api/v1/upload-pdf", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        alert("인증 실패! 다시 로그인해주세요.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ 서버 응답 오류:", errText);
        alert("업로드 실패: " + errText);
        return;
      }

      const result = await response.json();
      console.log("✅ 분석 결과:", result);
      alert(result.message || "업로드 성공!");

      // 필요 시 결과 페이지 이동
      // navigate("/result", { state: result });

    } catch (error) {
      console.error("❌ 요청 중 에러 발생:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <div className="resume-pdf-upload-container">
  <div className="resume-tab-bar">
    <button type="button" className="resume-tab-active2">PDF분석</button>
    <button type="button" className="resume-tab2" onClick={goToJobPage}>직무분석</button>
  </div>

  <div className="resume-input-button-row">
    <input
      type="file"
      accept="application/pdf"
      className="resume-pdf-input"
      onChange={handleFileChange}
      placeholder="PDF파일을 올려주세요"
    />
    <button type="button" className="resume-pdf-upload-button" onClick={uploadPDF}>분석시작</button>
  </div>
</div>

    </div>
  );
}
