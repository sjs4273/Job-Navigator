import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import WorkIcon from "@mui/icons-material/Work";
import "react-vertical-timeline-component/style.min.css";
import "./RoadmapVisual.css";

export default function RoadmapVisual() {
  const location = useLocation();
  const { selectedJob, selectedSkills, result } = location.state;
  const [data, setData] = useState(null);

  useEffect(() => {
    const mockData = {
      roadmap_steps: [
        {
          title: "기술 트렌드 분석 기반 기초 다지기",
          description: "TypeScript와 React의 높은 성장률을 기반으로 기초 문법과 컴포넌트 설계 능력을 강화하세요."
        },
        {
          title: "선택한 기술 장단점 보완",
          description: "Spring Boot의 빠른 개발 강점을 살려 작은 백엔드 프로젝트를 진행하고, 메모리 최적화 기법을 학습하세요."
        },
        {
          title: "대체 기술 대응과 경쟁력 확보",
          description: "Node.js의 대체 위험을 고려하여 Go와 Rust를 간단히 체험하며 스펙트럼을 확장하세요."
        },
        {
          title: "스택 확장 및 협업 경험",
          description: "Docker, Kubernetes, CI/CD 도구를 활용하여 DevOps 환경과 협업 능력을 키워보세요."
        },
        {
          title: "시장 수요 기반 대규모 프로젝트 도전",
          description: "Java + Spring Boot 조합의 높은 시장 수요를 기반으로 팀 프로젝트에 기여하고 실무 경험을 쌓으세요."
        },
        {
          title: "체계적 학습 순서 계획",
          description: "기초 → 작은 프로젝트 → 협업 → 오픈소스 참여 순으로 로드맵을 계획해 성장하세요."
        }
      ]
    };
    setData(mockData);
  }, []);

  if (!data) return <p>로드맵 로딩 중...</p>;

  const colors = ["#2563eb", "#22c55e", "#f97316", "#10b981", "#9333ea", "#f43f5e"];

  return (
    <div className="roadmap-visual-container">
      <h2>커리어 로드맵</h2>
      <VerticalTimeline lineColor="#2563eb">
        {data.roadmap_steps.map((step, index) => (
          <VerticalTimelineElement
            key={index}
            date={`Step ${index + 1}`}
            iconStyle={{ background: colors[index % colors.length], color: "#fff" }}
            icon={<WorkIcon />}
            contentStyle={{ background: "#f9fafb", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "12px" }}
            contentArrowStyle={{ borderRight: "7px solid #f9fafb" }}
          >
            <h3 className="roadmap-title">{step.title}</h3>
            <p className="roadmap-description">{step.description}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
}
