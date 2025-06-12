import { useEffect, useState } from 'react';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/jobs/")
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 오류");
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>채용공고 목록</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <strong>{job.title}</strong> - {job.company} ({job.location})
            <p>{job.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Jobs;
