import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// تأكدي من تثبيت react-icons باستخدام: npm install react-icons
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="modern-footer">
      <style>{`
        .modern-footer {
          background: #04060f;
          padding: 80px 20px 30px;
          color: #f0f6ff;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(0, 212, 255, 0.1);
        }

        /* إضافة توهج خلفي بسيط */
        .modern-footer::before {
          content: "";
          position: absolute;
          top: -150px;
          left: 50%;
          transform: translateX(-50%);
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.1), transparent 70%);
          pointer-events: none;
        }

        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          position: relative;
          z-index: 2;
        }

        .footer-section h3, .footer-section h4 {
          color: #00d4ff;
          margin-bottom: 25px;
          font-size: 1.2rem;
          letter-spacing: 1px;
        }

        .footer-section p {
          color: #a8c0d8;
          line-height: 1.8;
          font-size: 0.95rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #a8c0d8;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .footer-links a:hover {
          color: #00d4ff;
          transform: translateX(8px);
        }

        /* ── Social Media Icons ── */
        .social-icons {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(0, 212, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f0f6ff;
          font-size: 1.2rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .social-icon:hover {
          background: #00d4ff;
          color: #04060f;
          transform: translateY(-5px) rotate(360deg);
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
        }

        .footer-bottom {
          margin-top: 60px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          text-align: center;
          font-size: 0.85rem;
          color: #5a7a9a;
        }

        @media (max-width: 768px) {
          .footer-grid { text-align: center; }
          .social-icons { justify-content: center; }
          .footer-links a:hover { transform: scale(1.1); }
        }
      `}</style>

      <div className="footer-grid">
        {/* About Column */}
        <div className="footer-section">
          <h3>🧪 3D-Simuscience</h3>
          <p>
            The future of science education. Safe, interactive, and immersive
            3D chemical reactions at your fingertips.
          </p>
          <div className="social-icons">
            <a href="#" className="social-icon"><FaFacebook /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
            <a href="#" className="social-icon"><FaGithub /></a>
            <a href="#" className="social-icon"><FaLinkedin /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/LabScene">Virtual Lab</Link></li>
            <li><Link to="/ChemicalTools">Lab Tools</Link></li>
            <li><Link to="/Review">Feedback</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: aya.ayman@simulab.edu</p>
          <p>Cairo, Egypt</p>
          <p style={{ marginTop: "10px", color: "#00d4ff", fontSize: "0.8rem" }}>
            Available 24/7 for support
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 3D-Simuscience | Designed with ❤️ for Science Students</p>
      </div>
    </footer>
  );
}