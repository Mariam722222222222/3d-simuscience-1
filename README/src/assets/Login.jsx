import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const data = await loginUser({
      email,
      password,
    });

    const token = data.access_token;

    // ✅ خزني التوكن
    localStorage.setItem("token", token);

    // ⭐ مهم: خزني بيانات المستخدم
    const userData = {
      username: data.user?.username || email.split("@")[0],
      email: data.user?.email || email,
    };

    localStorage.setItem("user", JSON.stringify(userData));

     // 🔥 مهم جدًا لتحديث الـ navbar فورًا
// بعد حفظ user
localStorage.setItem("user", JSON.stringify(userData));
localStorage.setItem("token", token);

// 👇 مهم جداً
window.dispatchEvent(new Event("userChanged"));

navigate("/");
    // روحي للهوم أو البروفايل
    navigate("/");

  } catch (error) {
    alert("Invalid email or password");
  }
};
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="submit-btn">Login</button>
        </form>
      </div>
    </div>
  );
}