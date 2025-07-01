import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaRocket, FaCode, FaTools, FaProjectDiagram, FaUserTie } from "react-icons/fa";

export default function PDFRoadmapPage() {
  const roadmap = [
    {
      title: "1단계: 현재 스택 강점 유지 및 기본기 강화",
      description: "기존 기술 스택을 기반으로 프로젝트 경험을 쌓고, 코드 품질, 테스트, 보안 등 기본기를 다집니다.",
      icon: <FaCode />,
    },
    {
      title: "2단계: 신기술 학습 및 대체 기술 대응",
      description: "TypeScript, Go, Rust, Next.js 등 최신 기술을 학습하고, 개인 토이 프로젝트나 PoC를 통해 실전 경험을 쌓습니다.",
      icon: <FaTools />,
    },
    {
      title: "3단계: 스택 확장 및 역할 다변화",
      description: "프론트, 백엔드, 클라우드 등 다양한 기술을 접하며 팀 리딩 및 멘토링 경험을 병행합니다.",
      icon: <FaProjectDiagram />,
    },
    {
      title: "4단계: 시장 수요 기반 프로젝트 도전",
      description: "오픈소스 참여, 블로그, 대규모 프로젝트 리드 등으로 네트워크와 문제 해결 능력을 강화합니다.",
      icon: <FaRocket />,
    },
    {
      title: "5단계: 장기적 브랜딩 및 리더십 강화",
      description: "기술 심화 → 협업 및 문제 해결 → 기술 리더십 준비. 발표 및 커뮤니티 활동으로 브랜딩.",
      icon: <FaUserTie />,
    },
  ];

  const handleSave = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const roadmapData = roadmap.map((step) => ({
      title: step.title,
      description: step.description,
    }));

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      alert("userInfo가 없습니다. 먼저 로그인해주세요.");
      return;
    }

    const newRoadmap = {
      date: new Date().toISOString(),
      steps: roadmapData,
    };

    const updatedUserInfo = {
      ...userInfo,
      roadmaps: [...(userInfo.roadmaps || []), newRoadmap],
    };

    localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

    alert("새로운 로드맵이 프로필에 저장되었습니다!");
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>🚀 커리어 로드맵</h2>
      <VerticalTimeline>
        {roadmap.map((step, index) => (
          <VerticalTimelineElement
            key={index}
            contentStyle={{ background: "#f0f0f0", color: "#333" }}
            contentArrowStyle={{ borderRight: "7px solid #f0f0f0" }}
            iconStyle={{ background: "#0d6efd", color: "#fff" }}
            icon={step.icon}
          >
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>

      <button
        style={{
          display: "block",
          margin: "30px auto",
          padding: "10px 20px",
          background: "#0d6efd",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        onClick={handleSave}
      >
        로드맵 저장하기
      </button>
    </div>
  );
}
