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
    localStorage.removeItem("userInfo");

    // 네이버
    const naverCode = queryParams.get("code");
    const naverState = queryParams.get("state");

    if (naverCode && naverState) {
      fetch(`${API_BASE_URL}/api/v1/auth/naver-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: naverCode, state: naverState }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const error = await res.json();
            alert("네이버 로그인 실패: " + (error.detail || "알 수 없는 오류"));
            navigate("/login");
            return;
          }
          const user = await res.json();
          localStorage.setItem("access_token", user.access_token);
          localStorage.setItem("userInfo", JSON.stringify(user));
          setUserInfo(user);
          navigate("/");
        })
        .catch(() => {
          alert("네이버 로그인 중 네트워크 오류 발생");
          navigate("/login");
        });
      return;
    }

    // 카카오
    const kakaoCode = queryParams.get("code");
    if (kakaoCode && !naverState) {
      fetch(`${API_BASE_URL}/api/v1/auth/kakao-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: kakaoCode }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const error = await res.json();
            alert("카카오 로그인 실패: " + (error.detail || "알 수 없는 오류"));
            navigate("/login");
            return;
          }
          const user = await res.json();
          localStorage.setItem("access_token", user.access_token);
          localStorage.setItem("userInfo", JSON.stringify(user));
          setUserInfo(user);
          navigate("/");
        })
        .catch(() => {
          alert("카카오 로그인 중 네트워크 오류 발생");
          navigate("/login");
        });
      return;
    }

    // 구글
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
  }, []);

  const handleGoogleLogin = async (response) => {
    const id_token = response.credential;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token_str: id_token }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert("구글 로그인 실패: " + (error.detail || "알 수 없는 오류"));
        return;
      }

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUserInfo(data);
      navigate("/");
    } catch {
      alert("구글 로그인 중 네트워크 오류 발생");
    }
  };

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
      <div className="social-button google" style={{ padding: 0, border: "none" }}>
        <div id="google-login-btn" style={{ width: "100%" }} />
      </div>

      <button className="social-button naver" onClick={handleNaverLogin}>
        <img src="/naver.png" alt="네이버 로그인" className="naver-img-button" />
      </button>

      <button className="social-button kakao" onClick={handleKakaoLogin}>
        <img src="/kakao.png" alt="카카오 로그인" className="kakao-img-button" />
      </button>
    </div>
  );
}
