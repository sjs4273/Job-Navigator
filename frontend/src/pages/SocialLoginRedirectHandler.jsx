import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SocialLoginRedirectHandler({ setUserInfo }) {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const naverCode = queryParams.get("code");
    const naverState = queryParams.get("state");
    const kakaoCode = queryParams.get("code");

    if (naverCode && naverState) {
      fetch(`${API_BASE_URL}/api/v1/auth/naver-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: naverCode, state: naverState }),
      })
        .then(res => res.json())
        .then(user => {
          localStorage.setItem("access_token", user.access_token);
          localStorage.setItem("userInfo", JSON.stringify(user));
          setUserInfo(user);
          navigate("/");
        })
        .catch(() => {
          alert("네이버 로그인 실패");
          navigate("/");
        });
    } else if (kakaoCode && !naverState) {
      fetch(`${API_BASE_URL}/api/v1/auth/kakao-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: kakaoCode }),
      })
        .then(res => res.json())
        .then(user => {
          localStorage.setItem("access_token", user.access_token);
          localStorage.setItem("userInfo", JSON.stringify(user));
          setUserInfo(user);
          navigate("/");
        })
        .catch(() => {
          alert("카카오 로그인 실패");
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, []);

  return null;
}
