import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="custom-navbar">
        <div className="navbar-container">
          {/* اللوجو في أقصى اليسار */}
          <div className="navbar-logo">
            <Link to="/" onClick={closeMenu}>
              <img src={logo} alt="Logo" className="lo1" />
            </Link>
          </div>

          {/* زر الموبايل (الهامبرجر) */}
          <button className="menu-toggle" onClick={toggleMenu}>
            {isOpen ? "✕" : "☰"}
          </button>

          {/* الروابط في أقصى اليمين */}
          <ul className={`navbar-nav ${isOpen ? "active" : ""}`}>
            <li><Link className="nav-link-item" to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link className="nav-link-item" to="/Register" onClick={closeMenu}>Register</Link></li>
            <li><Link className="nav-link-item" to="/Login" onClick={closeMenu}>Login</Link></li>
            {/* <li><Link className="nav-link-item" to="/UserProfile" onClick={closeMenu}>User Profile</Link></li> */}
            <li><Link className="nav-link-item" to="/Review" onClick={closeMenu}>Review</Link></li>
            <li><Link className="nav-link-item" to="/ChemicalTools" onClick={closeMenu}>Chemical Tools</Link></li>
          </ul>
        </div>
      </nav>

      {/* الـ CSS مدمج في نفس الملف */}
      <style>{`
        .custom-navbar {
          width: 100%;
          background: rgba(8, 13, 28, 0.9);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(0, 212, 255, 0.15);
          padding: 10px 0;
          position: sticky;
          top: 0;
          z-index: 2000;
        }

        .navbar-container {
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between; /* توزيع اللوجو يسار والروابط يمين */
          padding: 0 24px;
        }

        .navbar-logo img {
          height: 45px;
          display: block;
        }

        .navbar-nav {
          display: flex;
          list-style: none;
          gap: 24px;
          margin: 0;
          padding: 0;
          transition: all 0.4s ease;
        }

        .nav-link-item {
          color: #f0f6ff;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          transition: color 0.3s ease;
          position: relative;
        }

        .nav-link-item:hover {
          color: #00d4ff;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #00d4ff;
          font-size: 28px;
          cursor: pointer;
          z-index: 2100;
        }

        /* التصميم المتجاوب (Responsive) */
        @media (max-width: 992px) {
          .menu-toggle {
            display: block;
          }

          .navbar-nav {
            position: fixed;
            top: 0;
            right: -100%; /* مخفي خارج الشاشة يميناً */
            width: 70%;
            height: 100vh;
            background: rgba(4, 6, 15, 0.98);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 30px;
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
          }

          .navbar-nav.active {
            right: 0; /* يظهر عند التفعيل */
          }

          .nav-link-item {
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
}