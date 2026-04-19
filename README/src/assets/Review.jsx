import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Review() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // استقبال اسم التجربة
  const { experimentName } = location.state || { experimentName: "Scientific Experiment" };

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = {
      experimentName,
      rating,
      comment,
      date: new Date().toLocaleString(),
    };

    const existingReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    localStorage.setItem("reviews", JSON.stringify([...existingReviews, reviewData]));
    setSubmitted(true);
  };

  return (
    <div className="review-page-container">
      <style>{`
        .review-page-container {
          min-height: 100vh;
          background: radial-gradient(circle at top, #0d1b3e, #04060f);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
          color: #f0f6ff;
        }

        .review-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 30px;
          padding: 40px;
          width: 100%;
          max-width: 550px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          text-align: center;
        }

        .review-card h1 {
          font-size: 2rem;
          background: linear-gradient(135deg, #00d4ff, #7b61ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }

        .experiment-badge {
          display: inline-block;
          padding: 5px 15px;
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 20px;
          color: #00d4ff;
          font-size: 0.9rem;
          margin-bottom: 30px;
        }

        .stars-container {
          margin: 25px 0;
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .star {
          font-size: 40px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: rgba(255, 255, 255, 0.1);
        }

        .star.active {
          color: #ffcc00;
          text-shadow: 0 0 15px rgba(255, 204, 0, 0.6);
        }

        .comment-area {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 15px;
          color: #fff;
          font-size: 1rem;
          resize: none;
          margin-bottom: 25px;
          outline: none;
          transition: border 0.3s ease;
        }

        .comment-area:focus {
          border-color: #00d4ff;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          border-radius: 15px;
          border: none;
          background: linear-gradient(135deg, #00d4ff, #7b61ff);
          color: white;
          font-weight: bold;
          font-size: 1.1rem;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(0, 212, 255, 0.2);
        }

        .success-icon {
          font-size: 60px;
          color: #00ffaa;
          margin-bottom: 20px;
        }
      `}</style>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div 
            key="form"
            className="review-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <h1>Share Your Feedback</h1>
            <div className="experiment-badge">{experimentName}</div>

            <form onSubmit={handleSubmit}>
              <label style={{ color: "#a8c0d8" }}>Rate your experience:</label>
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.span
                    key={star}
                    className={`star ${(hover || rating) >= star ? "active" : ""}`}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ★
                  </motion.span>
                ))}
              </div>

              <textarea
                className="comment-area"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                placeholder="What did you think of the reaction simulation?"
                required
              />

              <motion.button
                type="submit"
                className="submit-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Review
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            className="review-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="success-icon">✓</div>
            <h2>Thank You!</h2>
            <p style={{ color: "#a8c0d8", marginBottom: "30px" }}>
              Your feedback helps us improve the 3D Simuscience experience.
            </p>
            <motion.button
              className="submit-btn"
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.02 }}
            >
              Return to Lab
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}