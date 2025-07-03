import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import './Header.css';
import LoginModal from '../components/LoginModal';

export default function Header({ userInfo, setUserInfo }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [tokenRemaining, setTokenRemaining] = useState('');

  const handleLogout = () => {
    [
      'userInfo',
      'token',
      'access_token',
      'userId',
      'userNick',
      'signupData',
      'kakao_state',
      'com.naverid.oauth.state_token',
    ].forEach((key) => localStorage.removeItem(key));
    setUserInfo(null);
    setTokenRemaining('');
    navigate('/');
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }

    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expTime = new Date(payload.exp * 1000);

        const interval = setInterval(() => {
          const now = new Date();
          const diff = Math.floor((expTime - now) / 1000);

          if (diff <= 0) {
            // ✅ 토큰 만료 처리
            setTokenRemaining('⚠️ 만료됨');
            setUserInfo(null);
            localStorage.removeItem('access_token');
            clearInterval(interval);
          } else {
            const min = Math.floor(diff / 60);
            const sec = diff % 60;
            setTokenRemaining(`⏳ ${min}분 ${sec}초 남음`);
          }
        }, 1000);

        return () => clearInterval(interval);
      } catch (e) {
        console.error('토큰 디코딩 오류:', e);
      }
    }
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-top">
          <Link to="/">
            <img src="logo.png" alt="로고" className="logo" />
          </Link>

          <div className="auth-links">
            {userInfo ? (
              <>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton onClick={handleMenuOpen}>
                    <Avatar
                      src={
                        userInfo?.profile_image?.startsWith('http')
                          ? userInfo.profile_image
                          : `${import.meta.env.VITE_API_BASE_URL}${userInfo.profile_image}?t=${new Date().getTime()}`
                      }
                      sx={{
                        width: 36,
                        height: 36,
                        border: '1.5px solid #e0e0e0',
                        '&:hover': { borderColor: 'rgb(194, 194, 194)' },
                      }}
                    />
                  </IconButton>
                  {tokenRemaining && (
                    <Typography variant="caption" color="text.secondary">
                      {tokenRemaining}
                    </Typography>
                  )}
                </Box>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate('/mypage');
                    }}
                  >
                    마이페이지
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      handleLogout();
                    }}
                  >
                    로그아웃
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button onClick={() => setLoginOpen(true)}>로그인</Button>
            )}
          </div>
        </div>

        <div className="header-menu">
          {[{ label: '트렌드 분석', link: '/trend' }, { label: '채용 공고', link: '/jobs' }].map(
            ({ label, link }) => (
              <Button
                key={label}
                onClick={() => navigate(link)}
                variant="text"
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#333',
                  '&:hover': { color: '#1976d2' },
                }}
              >
                {label}
              </Button>
            )
          )}

          <Button
            key="이력서 분석"
            onClick={() => {
              if (userInfo) {
                navigate('/resume');
              } else {
                setLoginOpen(true);
              }
            }}
            variant="text"
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: '#333',
              '&:hover': { color: '#1976d2' },
            }}
          >
            이력서 분석
          </Button>
        </div>
      </header>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        setUserInfo={setUserInfo}
      />
    </>
  );
}
