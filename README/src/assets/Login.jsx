import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = { name: email.split("@")[0], email };
    localStorage.setItem("user", JSON.stringify(userData));

    if (location.state?.redirectToLab) navigate("/LabScene");
    else navigate("/userprofile");
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