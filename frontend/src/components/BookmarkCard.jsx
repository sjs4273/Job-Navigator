// components/BookmarkCard.jsx
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Skeleton,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function BookmarkCard({ bookmarkedJobs: initialJobs }) {
  const [bookmarkedJobs, setBookmarkedJobs] = useState(
    initialJobs.map((job) => ({ ...job, liked: true }))
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleUnlike = (job_post_id) => {
    // 1. 하트만 먼저 비우고
    setBookmarkedJobs((prev) =>
      prev.map((job) =>
        job.job_post_id === job_post_id ? { ...job, liked: false } : job
      )
    );

    // 2. 카드 삭제 + 알림
    setTimeout(() => {
      setBookmarkedJobs((prev) =>
        prev.filter((job) => job.job_post_id !== job_post_id)
      );
      setSnackbarOpen(true);
    }, 100); // 아주 짧은 시간 뒤 제거 (UI 전환을 눈으로 확인 가능)

    // 3. API 요청은 뒤에
    axios
      .delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/bookmarks/${job_post_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .catch((err) => console.error('❌ 즐겨찾기 해제 실패:', err));
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Slider {...settings}>
        {bookmarkedJobs.map((bookmark) => (
          <Box key={bookmark.bookmark_job_id} sx={{ px: 0.75 }}>
            <JobCard
              job_post_id={bookmark.job_post_id}
              liked={bookmark.liked}
              onUnlike={handleUnlike}
            />
          </Box>
        ))}
      </Slider>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info">즐겨찾기가 해제되었습니다</Alert>
      </Snackbar>
    </Box>
  );
}

function CustomArrow({ direction, onClick }) {
  const isLeft = direction === 'left';
  return (
    <Box
      className={`slick-arrow slick-${direction}`}
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '40%',
        [isLeft ? 'left' : 'right']: -40,
        zIndex: 2,
        cursor: 'pointer',
        backgroundColor: 'white',
        borderRadius: '50%',
        p: '6px',
      }}
    >
      {isLeft ? (
        <ArrowBackIosNewIcon fontSize="small" />
      ) : (
        <ArrowForwardIosIcon fontSize="small" />
      )}
    </Box>
  );
}

function JobCard({ job_post_id, liked, onUnlike }) {
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/jobs/${job_post_id}`
        );
        if (!res.ok) throw new Error('채용공고 불러오기 실패');
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJob();
  }, [job_post_id]);

  if (error) return <Typography color="error">채용공고 로딩 실패</Typography>;
  if (!job)
    return (
      <Card sx={{ width: 220, height: 220, borderRadius: 3, boxShadow: 3 }}>
        <Skeleton variant="rectangular" height={210} />
      </Card>
    );

  return (
    <Card
      sx={{
        width: 220,
        height: expanded ? 'auto' : 220,
        borderRadius: 3,
        boxShadow: 3,
        mb: 2,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Chip
            label={job.job_type}
            size="small"
            sx={{
              backgroundColor: '#f0f4ff',
              color: '#1976d2',
              fontWeight: 500,
            }}
          />
          <IconButton onClick={() => onUnlike(job_post_id)} size="small">
            {liked ? (
              <FavoriteIcon fontSize="small" sx={{ color: '#6EA8FE' }} />
            ) : (
              <FavoriteBorderIcon fontSize="small" sx={{ color: '#6EA8FE' }} />
            )}
          </IconButton>
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          {job.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {job.company} · {job.location}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          💼 {job.experience || '경력 무관'}
        </Typography>
        <Typography variant="body2">
          📅 마감일: {job.due_date_text || '미정'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            기술 스택
          </Typography>
          <IconButton onClick={() => setExpanded(!expanded)} size="small">
            {expanded ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>
        </Box>

        <Box
          sx={{
            mt: 1,
            maxHeight: expanded ? 80 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
          }}
        >
          <Stack
            direction="row"
            spacing={0.5}
            flexWrap="wrap"
            sx={{ rowGap: 0.5 }}
          >
            {(job.tech_stack || []).map((tech, i) => (
              <Chip
                key={i}
                label={tech.trim()}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 22,
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  borderRadius: '999px',
                  border: 'none',
                }}
              />
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
