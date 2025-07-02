import { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  Button,
  Box,
  Container,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';
import JobFilter from '../components/JobFilter';
import './JobsPage.css';

// ✅ 경력 필터 매핑
const experienceMap = {
  무관: { min: null, max: null },
  '신입 포함': { min: 0, max: 0 },
  '1년 이상': { min: 1, max: null },
  '3년 이상': { min: 3, max: null },
  '5년 이상': { min: 5, max: null },
  '10년 이상': { min: 10, max: null },
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [bookmarkIds, setBookmarkIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const [filters, setFilters] = useState({
    job_type: '',
    location: '',
    experience: '',
  });

  // ✅ 서버에 페이지 + 필터 + 검색 쿼리 요청
  useEffect(() => {
    const params = new URLSearchParams({
      page: currentPage,
      size: jobsPerPage,
    });

    if (filters.job_type) params.append('job_type', filters.job_type);
    if (filters.location) params.append('location', filters.location);
    if (search) params.append('tech_stack', search); // 또는 'keyword', 'query' 등 변경 가능

    // ✅ 경력 필터를 숫자 범위로 변환하여 추가
    const { min, max } = experienceMap[filters.experience] || {};
    if (min !== null && min !== undefined) {
      params.append('min_experience', min);
    }
    if (max !== null && max !== undefined) {
      params.append('max_experience', max);
    }

    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/jobs?${params.toString()}`
    )
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.items);
        setTotalCount(data.total_count);
      })
      .catch(console.error);
  }, [currentPage, filters, search]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/bookmarks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const ids = data.map((b) => b.job_post_id); // 즐겨찾기 ID 목록 추출
        setBookmarkIds(ids);
      })
      .catch(console.error);
  }, []);

  const handleSearch = () => {
    setSearch(input);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / jobsPerPage);
  useEffect(() => {
    // 필터 값이 바뀔 때마다 실행됨
    console.log('현재 필터:', filters);
  }, [filters]);
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* 검색 입력 */}
      <Box className="search-bar">
        <TextField
          className="search-input"
          variant="outlined"
          placeholder="채용공고 제목 및 회사를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Button className="search-btn" onClick={handleSearch}>
          검색
        </Button>
      </Box>

      {/* 필터 선택 */}
      <JobFilter filters={filters} onChange={setFilters} />

      {/* 채용공고 카드 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 3,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* 왼쪽 열 */}
        <Box sx={{ flex: 1, maxWidth: 350 }}>
          {jobs
            .filter((_, i) => i % 2 === 0)
            .map((job) => (
              <JobCard key={job.id} job={job} bookmarkIds={bookmarkIds} />
            ))}
        </Box>

        {/* 오른쪽 열 */}
        <Box sx={{ flex: 1, maxWidth: 350 }}>
          {jobs
            .filter((_, i) => i % 2 === 1)
            .map((job) => (
              <JobCard key={job.id} job={job} bookmarkIds={bookmarkIds} />
            ))}
        </Box>
      </Box>

      {/* ⏩ 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
}

export default Jobs;
