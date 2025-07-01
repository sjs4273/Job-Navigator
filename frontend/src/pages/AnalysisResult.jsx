import { useLocation, useNavigate } from "react-router-dom";
import "./AnalysisResult.css";

export default function RoadmapResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, selectedJob, selectedSkills } = location.state;

  // 👉 버튼 클릭 시 이동 (예: 분석 페이지)
  const handleCreateRoadmap = () => {
  navigate("/roadmap-visual", {
    state: { selectedJob, selectedSkills, result }
  });
};

  return (
    <div className="result-container">
      <div className="header-bar">
        <h2>분석 결과</h2>
        <button className="create-roadmap-btn" onClick={handleCreateRoadmap}>
          로드맵 만들기
        </button>
      </div>

      <div className="selected-info">
        <p><strong>선택한 직무:</strong> {selectedJob}</p>
        <p><strong>선택한 기술:</strong> {selectedSkills.join(", ")}</p>
      </div>

      <div className="sections-container">
        {Object.entries(result).map(([key, section]) => (
          <div className="section-card" key={key}>
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
