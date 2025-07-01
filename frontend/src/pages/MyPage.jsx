import React, { useState, useEffect } from 'react';
import './MyPage.css';
import {
  Box,
  Avatar,
  Typography,
  Chip,
  Paper,
  Divider,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export default function MyPage({ userInfo, setUserInfo }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const userData = localStorage.getItem('userInfo');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
              {user.email || '이메일 없음'}
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

      <Box className="section-box">
        <Typography variant="subtitle1" className="section-title">
          나의 로드맵
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mt: 1 }}>
          {(user?.roadmap || []).map((step, idx) => (
            <Paper key={idx} elevation={2} sx={{ padding: '8px' }}>
              <Typography variant="subtitle2">{step.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </Paper>
          ))}
        </Box>
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
