import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // ✅ تحميل user وتحديثه
  const loadUser = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  // ✅ قفل dropdown لو ضغطت بره
useEffect(() => {
  const loadUser = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
  };

  loadUser();
  window.addEventListener("userChanged", loadUser);

  return () => window.removeEventListener("userChanged", loadUser);
}, []);

  const firstLetter =
    user?.username?.charAt(0).toUpperCase() || "G";

  // ✅ Logout مضبوط
  const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  setUser(null);
  setDropdownOpen(false);
  setIsOpen(false);

  window.dispatchEvent(new Event("userChanged"));

  // يرجع للهوم ويقفل كل حاجة
  window.location.href = "/";
};
  return (
    <>
      <nav className="custom-navbar">
        <div className="navbar-container">

          {/* LOGO (رجعته زي ما هو بدون تصغير) */}
          <div className="navbar-logo">
            <Link to="/" onClick={closeMenu}>
              <img src={logo} alt="Logo" className="lo1" />
            </Link>
          </div>

          {/* MENU BUTTON */}
          <button className="menu-toggle" onClick={toggleMenu}>
            {isOpen ? "✕" : "☰"}
          </button>

          {/* LINKS */}
          <ul className={`navbar-nav ${isOpen ? "active" : ""}`}>
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/Register" onClick={closeMenu}>Register</Link></li>
         <Link
  to="/Login"
  onClick={() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }}
>
  Login
</Link>
            <li><Link to="/Review" onClick={closeMenu}>Review</Link></li>
            <li><Link to="/ChemicalTools" onClick={closeMenu}>Chemical Tools</Link></li>

            {/* USER */}
            <li className="user-menu" ref={dropdownRef}>
              <div
                className="user-avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {firstLetter}
              </div>

              <div className={`dropdown ${dropdownOpen ? "show" : ""}`}>
                <p className="user-name">
                  {user?.username || "Guest"}
                </p>
                <p className="user-email">
                  {user?.email || ""}
                </p>

                {user ? (
                  <button onClick={handleLogout}>Logout</button>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* STYLE (محافظ على ستايلك الأصلي + تحسين بسيط فقط) */}
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
          justify-content: space-between;
          padding: 0 24px;
        }

        /* 🔥 رجعنا اللوجو زي ما كان */
        .navbar-logo img {
          height: 45px;
        }

        .navbar-nav {
          display: flex;
          list-style: none;
          gap: 24px;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .navbar-nav a {
          color: #f0f6ff;
          text-decoration: none;
        }

        .navbar-nav a:hover {
          color: #00d4ff;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #00d4ff;
          font-size: 28px;
        }

        /* USER */
        .user-menu {
          position: relative;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg,#00d4ff,#0a6ebd);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

       .dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background: rgba(20, 28, 48, 0.95);
  backdrop-filter: blur(12px);
  padding: 14px;
  border-radius: 14px;
  min-width: 190px;

  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: 0.25s ease;

  border: 1px solid rgba(0, 212, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.dropdown.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.name {
  color: #00d4ff;
  font-weight: 600;
  font-size: 14px;
}

.email {
  color: #aab4c5;
  font-size: 12px;
  margin-bottom: 10px;
}

/* زرار Login داخل القائمة */
.dropdown a {
  display: block;
  text-align: center;
  margin-top: 10px;
  padding: 8px;
  border-radius: 10px;
  background: rgba(0, 212, 255, 0.15);
  color: #00d4ff;
  text-decoration: none;
  transition: 0.2s;
}

.dropdown a:hover {
  background: rgba(0, 212, 255, 0.3);
}

/* زرار logout */
.dropdown button {
  margin-top: 10px;
  background: rgba(255, 70, 70, 0.15);
  border: 1px solid rgba(255, 70, 70, 0.3);
  color: #ff5c5c;
  padding: 8px;
  width: 100%;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.dropdown button:hover {
  background: rgba(255, 70, 70, 0.25);
}
        }
      `}</style>
    </>
  );
}