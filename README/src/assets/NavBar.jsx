import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "./logo.png";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => setIsOpen(false);

  // Load user from localStorage
  const loadUser = () => {
    try {
      const data = JSON.parse(localStorage.getItem("user"));
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("userChanged", loadUser);
    return () => window.removeEventListener("userChanged", loadUser);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll detection for navbar style change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMenu();
    setDropdownOpen(false);
  }, [location.pathname]);

  const firstLetter = user?.username?.charAt(0).toUpperCase() || "G";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    setIsOpen(false);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/Review", label: "Review" },
    { to: "/ChemicalTools", label: "Chemical Tools" },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <nav className={`custom-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">

          {/* LOGO */}
          <div className="navbar-logo">
            <Link to="/" onClick={closeMenu}>
              <img src={logo} alt="Logo" className="lo1" />
            </Link>
          </div>

          {/* DESKTOP LINKS */}
          <ul className="navbar-nav desktop-nav">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={isActive(to) ? "nav-link active" : "nav-link"}
                >
                  {label}
                  {isActive(to) && <span className="active-dot" />}
                </Link>
              </li>
            ))}
          </ul>

          {/* RIGHT SIDE */}
          <div className="navbar-right">
            {/* Auth buttons - only show if not logged in */}
            {!user && (
              <div className="auth-buttons">
                <Link to="/Register" className="btn-register">Register</Link>
                <Link to="/Login" className="btn-login">Login</Link>
              </div>
            )}

            {/* User Avatar & Dropdown */}
            <div className="user-menu" ref={dropdownRef}>
              <button
                className={`user-avatar ${dropdownOpen ? "active" : ""}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                {firstLetter}
                {user && <span className="online-dot" />}
              </button>

              <div className={`dropdown ${dropdownOpen ? "show" : ""}`}>
                <div className="dropdown-header">
                  <div className="dropdown-avatar">{firstLetter}</div>
                  <div>
                    <p className="user-name">{user?.username || "Guest"}</p>
                    {user?.email && <p className="user-email">{user.email}</p>}
                  </div>
                </div>
                <div className="dropdown-divider" />
                {user ? (
                  <button className="logout-btn" onClick={handleLogout}>
                    <span>⎋</span> Logout
                  </button>
                ) : (
                  <Link to="/Login" className="login-link" onClick={() => setDropdownOpen(false)}>
                    <span>→</span> Login
                  </Link>
                )}
              </div>
            </div>

            {/* HAMBURGER */}
            <button
              className={`menu-toggle ${isOpen ? "open" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
          <div className="mobile-links">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={isActive(to) ? "mobile-link active" : "mobile-link"}
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}
            {!user && (
              <>
                <Link to="/Register" className="mobile-link" onClick={closeMenu}>Register</Link>
                <Link to="/Login" className="mobile-link" onClick={closeMenu}>Login</Link>
              </>
            )}
            {user && (
              <button className="mobile-logout" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .custom-navbar {
          width: 100%;
          font-family: 'Outfit', sans-serif;
          background: rgba(6, 10, 22, 0.75);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(0, 212, 255, 0.08);
          padding: 0;
          position: sticky;
          top: 0;
          z-index: 2000;
          transition: all 0.3s ease;
        }

        .custom-navbar.scrolled {
          background: rgba(6, 10, 22, 0.97);
          border-bottom-color: rgba(0, 212, 255, 0.18);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
        }

        .navbar-container {
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          height: 68px;
        }

        .navbar-logo img {
          height: 42px;
          display: block;
          transition: opacity 0.2s;
        }
        .navbar-logo img:hover { opacity: 0.85; }

        /* ---- DESKTOP NAV ---- */
        .desktop-nav {
          display: flex;
          list-style: none;
          gap: 4px;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .nav-link {
          position: relative;
          color: rgba(200, 215, 240, 0.8);
          text-decoration: none;
          font-size: 14.5px;
          font-weight: 500;
          letter-spacing: 0.02em;
          padding: 8px 14px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }
        .nav-link:hover {
          color: #00d4ff;
          background: rgba(0, 212, 255, 0.07);
        }
        .nav-link.active {
          color: #00d4ff;
        }
        .active-dot {
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #00d4ff;
          box-shadow: 0 0 6px #00d4ff;
        }

        /* ---- RIGHT SIDE ---- */
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .auth-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .btn-register {
          color: rgba(200, 215, 240, 0.75);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 7px 16px;
          border-radius: 8px;
          transition: all 0.2s;
          font-family: 'Outfit', sans-serif;
        }
        .btn-register:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }

        .btn-login {
          color: #060a16;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          padding: 7px 18px;
          border-radius: 8px;
          background: linear-gradient(135deg, #00d4ff, #0a8fd4);
          box-shadow: 0 2px 12px rgba(0, 212, 255, 0.25);
          transition: all 0.2s;
          font-family: 'Outfit', sans-serif;
        }
        .btn-login:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(0, 212, 255, 0.4);
        }

        /* ---- USER AVATAR ---- */
        .user-menu { position: relative; }

        .user-avatar {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00d4ff 0%, #0a6ebd 100%);
          border: 2px solid transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #060a16;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Outfit', sans-serif;
        }
        .user-avatar:hover,
        .user-avatar.active {
          border-color: rgba(0, 212, 255, 0.5);
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.12);
        }

        .online-dot {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #060a16;
        }

        /* ---- DROPDOWN ---- */
        .dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: rgba(12, 18, 35, 0.98);
          backdrop-filter: blur(20px);
          padding: 0;
          border-radius: 16px;
          min-width: 210px;
          opacity: 0;
          transform: translateY(-8px) scale(0.97);
          pointer-events: none;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(0, 212, 255, 0.12);
          box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03);
          overflow: hidden;
        }
        .dropdown.show {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 16px 14px;
        }

        .dropdown-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00d4ff, #0a6ebd);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: #060a16;
          flex-shrink: 0;
        }

        .user-name {
          color: #e8f0ff;
          font-weight: 600;
          font-size: 14px;
          margin: 0 0 2px;
          line-height: 1;
        }

        .user-email {
          color: rgba(140, 160, 195, 0.7);
          font-size: 12px;
          margin: 0;
          line-height: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(0, 212, 255, 0.08);
          margin: 0;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: #ff6b6b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Outfit', sans-serif;
          text-align: left;
        }
        .logout-btn:hover {
          background: rgba(255, 107, 107, 0.08);
          color: #ff8888;
        }

        .login-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          color: #00d4ff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.15s;
        }
        .login-link:hover {
          background: rgba(0, 212, 255, 0.08);
        }

        /* ---- HAMBURGER ---- */
        .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .menu-toggle:hover { background: rgba(255,255,255,0.06); }

        .menu-toggle span {
          display: block;
          width: 22px;
          height: 2px;
          background: rgba(200, 215, 240, 0.85);
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
        .menu-toggle.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .menu-toggle.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .menu-toggle.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* ---- MOBILE MENU ---- */
        .mobile-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-top: 1px solid transparent;
        }
        .mobile-menu.active {
          max-height: 400px;
          border-top-color: rgba(0, 212, 255, 0.08);
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          padding: 12px 20px 20px;
          gap: 4px;
        }

        .mobile-link {
          color: rgba(200, 215, 240, 0.75);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          padding: 12px 16px;
          border-radius: 10px;
          transition: all 0.2s;
          font-family: 'Outfit', sans-serif;
        }
        .mobile-link:hover,
        .mobile-link.active {
          color: #00d4ff;
          background: rgba(0, 212, 255, 0.07);
        }

        .mobile-logout {
          margin-top: 8px;
          padding: 12px 16px;
          background: rgba(255, 107, 107, 0.08);
          border: 1px solid rgba(255, 107, 107, 0.2);
          border-radius: 10px;
          color: #ff6b6b;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Outfit', sans-serif;
          text-align: left;
          width: 100%;
        }
        .mobile-logout:hover {
          background: rgba(255, 107, 107, 0.15);
        }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 768px) {
          .desktop-nav,
          .auth-buttons { display: none; }
          .menu-toggle { display: flex; }
          .navbar-container { height: 60px; }
        }
      `}</style>
    </>
  );
}