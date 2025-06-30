import { useLocation } from "react-router-dom";

export default function RoadmapResult() {
  const location = useLocation();
  const { result, selectedJob, selectedSkills } = location.state;

  return (
    <div>
      <h2>분석 결과</h2>
      <p><strong>선택한 직무:</strong> {selectedJob}</p>
      <p><strong>선택한 기술:</strong> {selectedSkills.join(", ")}</p>
      <h3>서버 응답 결과</h3>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
