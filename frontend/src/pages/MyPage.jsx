import React, { useState, useEffect } from 'react';
import './MyPage.css';
import {
  Box,
  Avatar,
  Typography,
  Chip,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import BookmarkCard from '../components/BookmarkCard';

export default function MyPage({ userInfo, setUserInfo }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      const token = localStorage.getItem('access_token');

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/update-image`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await res.json();
      localStorage.setItem('userInfo', JSON.stringify(result));
      setUser(result);
      setUserInfo(result);
    } catch (err) {
      console.error('❌ 이미지 업로드 실패:', err);
    }
    setSnackbarOpen(true);
  };

  const handleDeleteRoadmap = (index) => {
    if (!user) return;

    const updatedRoadmaps = [...(user.roadmaps || [])];
    updatedRoadmaps.splice(index, 1);

    const updatedUser = {
      ...user,
      roadmaps: updatedRoadmaps,
    };

    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setUserInfo(updatedUser);
  };

  useEffect(() => {
    const fetchBookmarkedJobs = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/bookmarks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await res.json();
        console.log('즐겨찾기 응답:', result, Array.isArray(result));

        setBookmarkedJobs(result);
      } catch (err) {
        console.error('❌ 즐겨찾기 공고 불러오기 실패:', err);
      }
    };

    fetchBookmarkedJobs();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('userInfo');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (!user) return <Typography>로그인 정보 없음</Typography>;

  return (
    <Box className="mypage-container">
      <Paper elevation={3} className="profile-card">
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>
          <Box sx={{ position: 'relative', width: 80, height: 80 }}>
            <Avatar
              sx={{ width: 80, height: 80, border: '1px solid #e0e0e0' }}
              src={
                user?.profile_image?.startsWith('http')
                  ? user.profile_image
                  : `${import.meta.env.VITE_API_BASE_URL}${user.profile_image}?t=${new Date().getTime()}`
              }
            />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#fff',
                width: 28,
                height: 28,
              }}
              onClick={() => document.getElementById('profile-file').click()}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <input
              type="file"
              id="profile-file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </Box>

          <Box sx={{ marginLeft: '1.5rem' }}>
            <Typography variant="h6">{user.name || '이름 없음'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email || '이메일 없음'}f
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.description || ''}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box className="section-box">
        <Typography variant="subtitle1" className="section-title">
          나의 기술 스택
        </Typography>
        <Box className="chip-container">
          {(user?.skills || []).map((skill, idx) => (
            <Chip key={idx} label={skill} className="skill-chip" />
          ))}
        </Box>
      </Box>

      {/* 즐겨찾기 공고 데이터 매핑 */}
<Box className="section-box" sx={{ mt: 4, mb: 6 }}>
  <Typography variant="subtitle1" className="section-title">
    즐겨찾기한 채용 공고
  </Typography>
  {bookmarkedJobs.length > 0 ? (
    <Box>
      <BookmarkCard bookmarkedJobs={bookmarkedJobs} />
    </Box>
  ) : (
    <Typography variant="body2" color="text.secondary">
      즐겨찾기한 채용공고가 없습니다.
    </Typography>
  )}
</Box>

<Box className="section-box" sx={{ mt: 4, mb: 6 }}>
  <Typography variant="subtitle1" className="section-title">
    나의 로드맵
  </Typography>

  {(user?.roadmaps || []).length > 0 ? (
    user.roadmaps.map((rm, rmIdx) => (
      <Accordion key={rmIdx} sx={{ mt: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">
            {formatDate(rm.date)} 커리어 로드맵
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {rm.steps.map((step, idx) => (
            <Paper key={idx} elevation={2} sx={{ padding: '8px', mb: 1 }}>
              <Typography variant="subtitle2">{step.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </Paper>
          ))}
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteRoadmap(rmIdx)}
            sx={{ mt: 1 }}
          >
            로드맵 삭제
          </Button>
        </AccordionDetails>
      </Accordion>
    ))
  ) : (
    <Typography variant="body2" color="text.secondary">
      저장된 로드맵이 없습니다.
    </Typography>
  )}
</Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2200}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          프로필 이미지가 수정되었습니다.
        </Alert>
      </Snackbar>
    </Box>
  );
}
