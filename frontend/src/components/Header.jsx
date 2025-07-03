// 📄 Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import './Header.css';
import LoginModal from '../components/LoginModal';

export default function Header({ userInfo, setUserInfo }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

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
    navigate('/');
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
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
          {[
            { label: '트렌드 분석', link: '/trend' },
            { label: '채용 공고', link: '/jobs' },
          ].map(({ label, link }) => (
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
          ))}

          {/* ✅ 이력서 분석 버튼: 로그인 여부 조건 분기 */}
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

      {/* ✅ 로그인 모달 컴포넌트 */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        setUserInfo={setUserInfo}
      />
    </>
  );
}
