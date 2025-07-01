// 📄 SummaryBox.jsx
import { useEffect } from 'react';

function SummaryBox({ summary, displayedSummary, setDisplayedSummary }) {
  useEffect(() => {
    if (!summary) return;

    const processed = summary.replace(/\. /g, '.\n');
    const chars = Array.from(processed);
    setDisplayedSummary('');

    let isCancelled = false;

    const streamText = async (i) => {
      if (i >= chars.length || isCancelled) return;
      setDisplayedSummary((prev) => prev + chars[i]);
      setTimeout(() => streamText(i + 1), 30);
    };

    streamText(0);
    return () => {
      isCancelled = true;
    };
  }, [summary, setDisplayedSummary]);

  return (
    <div className="summary-box">
      <p className="summary-title">기술 요약</p>
      {displayedSummary ? (
        displayedSummary.split('\n').map((line, idx) => <p key={idx}>{line}</p>)
      ) : (
        <p>✍️ 요약 생성 중입니다...</p>
      )}
    </div>
  );
}

export default SummaryBox;
