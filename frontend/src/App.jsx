import { useState, useEffect } from 'react'

function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('developer') // 기본 쿼리

  useEffect(() => {
    // 쿼리 파라미터 추가
    fetch(`http://localhost:8000/api/v1/jobs/?query=${encodeURIComponent(query)}`)
      .then((res) => {
        console.log('Response', res)
        // 응답 상태가 200이 아닐 경우 에러 처리
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        console.log('Data', data)
        setJobs(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [query])

  return (
    <div style={{ padding: 24 }}>
      <h1>Jobs List (from FastAPI)</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어 입력"
        style={{ marginBottom: 12 }}
      />
      <button onClick={() => setLoading(true)}>검색</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {Array.isArray(jobs) && jobs.length > 0 ? (
          jobs.map((job, idx) => (
            <li key={idx}>
              {typeof job === 'object' ? JSON.stringify(job) : job}
            </li>
          ))
        ) : (
          !loading && <p>데이터가 없습니다.</p>
        )}
      </ul>
    </div>
  )
}

export default App
