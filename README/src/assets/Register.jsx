import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
    phone: "", age: "", gender: "", city: "", country: ""
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // حفظ البيانات بمفتاح name ليتعرف عليه ملف الهوم
    const userData = { name: formData.fullName, email: formData.email };
    localStorage.setItem("user", JSON.stringify(userData));

    if (location.state?.redirectToLab) navigate("/LabScene");
    else navigate("/userprofile");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
          </div>
          <button type="submit" className="register-btn">Register</button>
        </form>
      </div>
    </div>
  );
}