import { useState, useEffect } from 'react'

function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('developer') // 실제 검색 쿼리
  const [inputValue, setInputValue] = useState('developer') // 입력창 값

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/jobs/?query=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        setJobs(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [query])

  const handleSearch = () => {
    setLoading(true)
    setQuery(inputValue) // 이때 쿼리가 바뀌면서 useEffect 실행됨
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Jobs List (from FastAPI)</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="검색어 입력"
        style={{ marginBottom: 12 }}
      />
      <button onClick={handleSearch}>검색</button>
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
