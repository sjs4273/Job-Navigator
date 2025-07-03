// 📄 components/ServiceSummarySection.jsx
import React from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import {
  services,
  flowSteps,
  reviews,
} from "../mock/footerMock.jsx";
import "./ServiceSummarySection.css";

export default function ServiceSummarySection() {
  return (
    <>
      <div className="service-summary-section">
        <h2>요즘머함은 이런 걸 제공해요! 수정해볼까요오오오오</h2>
        <div className="service-cards">
          {services.map((service, idx) => (
            <div key={idx} className="service-card">
              <div className="icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>

        <h2 style={{ marginTop: "4rem" }}>이렇게 사용해요!</h2>
        <div className="flow-steps">
          {flowSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flow-step">
                <div className="flow-icon">{step.icon}</div>
                <p>{step.label}</p>
              </div>
              {idx < flowSteps.length - 1 && (
                <ArrowRight size={20} color="#3a82f7" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="review-marquee-section">
        <h2>요즘머함 이용자들의 이야기</h2>
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {reviews.concat(reviews).map((review, idx) => (
              <div key={idx} className="review-card">
                <MessageCircle size={24} />
                <p className="quote">“{review.quote}”</p>
                <span className="name">– {review.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
