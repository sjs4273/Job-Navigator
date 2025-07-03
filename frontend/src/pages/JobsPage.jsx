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

const experienceMap = {
  무관: { min: null, max: null },
  '신입 포함': { min: 0, max: 100 },
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

  // ✅ 서버에서 전체 공고 가져오기 (검색어는 서버에 안 보냄)
  useEffect(() => {
    const params = new URLSearchParams({
      page: currentPage,
      size: jobsPerPage,
    });

    if (filters.job_type) params.append('job_type', filters.job_type);
    if (filters.location) params.append('location', filters.location);
    if (filters.tech_stack) params.append('tech_stack', filters.tech_stack);

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
  }, [currentPage, filters]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/bookmarks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const ids = data.map((b) => b.job_post_id);
        setBookmarkIds(ids);
      })
      .catch(console.error);
  }, []);

  // ✅ 검색 실행 함수
  const handleSearch = () => {
    setSearch(input); // 입력값 저장
    setCurrentPage(1);
  };

  // ✅ 제목/회사명 기준 필터링
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / jobsPerPage);

  return (
    <Container maxWidth="md" sx={{ mt: 9 }}>
      {/* 필터 */}
      <JobFilter filters={filters} onChange={setFilters} />

      {/* 카드 리스트 (2열 구조 유지) */}
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
        <Box sx={{ flex: 1, maxWidth: 380 }}>
          {filteredJobs
            .filter((_, i) => i % 2 === 0)
            .map((job) => (
              <JobCard key={job.id} job={job} bookmarkIds={bookmarkIds} />
            ))}
        </Box>

        {/* 오른쪽 열 */}
        <Box sx={{ flex: 1, maxWidth: 380 }}>
          {filteredJobs
            .filter((_, i) => i % 2 === 1)
            .map((job) => (
              <JobCard key={job.id} job={job} bookmarkIds={bookmarkIds} />
            ))}
        </Box>
      </Box>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
}

export default Jobs;
