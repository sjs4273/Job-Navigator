import { useEffect, useState } from 'react';
import Header from '../components/Header';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${baseURL}/api/v1/jobs/`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
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
  console.log(baseURL);
  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error}</p>;
  console.log('baseURL:', baseURL);
  
  return (
    <>
      <Header />
      <div style={{ padding: '1rem' }}>
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
    </>
  );
}

export default Jobs;
