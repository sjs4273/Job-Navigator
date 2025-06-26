import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SocialLoginButton.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SocialLoginButton({ setUserInfo }) {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    // ✅ 네이버 로그인 처리
    const naverCode = queryParams.get("code");
    const naverState = queryParams.get("state");
    if (naverCode && naverState) {
      fetch(`${API_BASE_URL}/api/v1/auth/naver-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: naverCode, state: naverState }),
      })
        .then((res) => res.json())
        .then((user) => {
          localStorage.setItem("access_token", user.access_token);
          localStorage.setItem("userInfo", JSON.stringify(user));
          setUserInfo(user);
          navigate("/");
        })
        .catch((err) => {
          console.error("❌ 네이버 로그인 실패:", err);
          navigate("/");
        });
      return;
    }

    // ✅ 카카오 로그인 처리
    const kakaoCode = queryParams.get("code");
    if (kakaoCode) {
      fetch(`${API_BASE_URL}/api/v1/auth/kakao-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: kakaoCode }),
      })
        .then((res) => res.json())
        .then((user) => {
          localStorage.setItem("access_token", user.access_token);
          localStorage.setItem("userInfo", JSON.stringify(user));
          setUserInfo(user);
          navigate("/");
        })
        .catch((err) => {
          console.error("❌ 카카오 로그인 실패:", err);
          navigate("/");
        });
      return;
    }

    // ✅ 구글 로그인 초기화
    if (window.google && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        { theme: "outline", size: "large", width: "250" }
      );
    }

    // ✅ 토큰 인증 상태 유지
    const token = queryParams.get("token");
    if (token) {
      localStorage.setItem("access_token", token);
      fetch(`${API_BASE_URL}/api/v1/auth/verify-token`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((user) => {
          localStorage.setItem("userInfo", JSON.stringify(user));
          setUserInfo(user);
          navigate("/");
        })
        .catch((err) => {
          console.error("❌ 유저 정보 조회 실패:", err);
          navigate("/");
        });
    }
  }, []);

  // ✅ Google 로그인 콜백
  const handleGoogleLogin = async (response) => {
    const id_token = response.credential;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token_str: id_token }),
      });
      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUserInfo(data);
      navigate("/");
    } catch (err) {
      console.error("❌ 구글 로그인 실패:", err);
    }
  };

  // ✅ 로그인 요청
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&prompt=login`;
    window.location.href = kakaoAuthUrl;
  };

  const handleNaverLogin = () => {
    const state = crypto.randomUUID();
    const redirectUri = `${window.location.origin}/login`;
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}&auth_type=reprompt`;
    window.location.href = naverAuthUrl;
  };

  return (
    <div className="social-login-wrapper">
      {/* ✅ 구글 버튼 */}
      <div className="social-button google" style={{ padding: 0, border: "none" }}>
        <div id="google-login-btn" style={{ width: "100%" }} />
      </div>

      {/* ✅ 네이버 이미지 버튼 */}
      <button className="social-button naver" onClick={handleNaverLogin}>
        <img src="/naver.png" alt="네이버 로그인" className="naver-img-button" />
      </button>

      {/* ✅ 카카오 이미지 버튼 */}
      <button className="social-button kakao" onClick={handleKakaoLogin}>
        <img src="/kakao.png" alt="카카오 로그인" className="kakao-img-button" />
      </button>
    </div>
  );
}
