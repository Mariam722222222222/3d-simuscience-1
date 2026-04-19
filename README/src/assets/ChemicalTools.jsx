import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🔹 الصور (تأكدي من صحة المسارات)
import tool1 from "./beaker-removebg-preview.png";
import tool2 from "./flask.png";
import tool3 from "./bureette.png";
import tool4 from "./test_tubejpg-removebg-preview.png";
import tool5 from "./bunsenburner.png";
import tool6 from "./balancejpg-removebg-preview.png";
import tool7 from "./thermometerjpg-removebg-preview.png";
import tool8 from "./pipettejpg-removebg-preview.png";
import tool9 from "./funnel-removebg-preview.png";
import tool10 from "./microscope-removebg-preview.png";
import tool11 from "./cylinderjpg-removebg-preview.png";
import tool12 from "./ptridishjpg.jpg";

const tools = [
  { id: 1, name: "Beaker", image: tool1, description: "Used to hold and mix liquids." },
  { id: 2, name: "Flask", image: tool2, description: "Used for mixing and heating solutions." },
  { id: 3, name: "Burette", image: tool3, description: "Measures precise liquid volumes." },
  { id: 4, name: "Test Tube", image: tool4, description: "Used for small-scale reactions." },
  { id: 5, name: "Bunsen Burner", image: tool5, description: "Produces a single open gas flame." },
  { id: 6, name: "Balance", image: tool6, description: "Measures mass very accurately." },
  { id: 7, name: "Thermometer", image: tool7, description: "Measures the temperature." },
  { id: 8, name: "Pipette", image: tool8, description: "Transports measured volumes." },
];

export default function ChemicalTools() {
  const [selectedTool, setSelectedTool] = useState(null);

  // مضاعفة المصفوفة لضمان استمرار الحركة بدون فجوات
  const duplicatedTools = [...tools, ...tools];

  return (
    <div className="modern-marquee-container">
      <style>{`
        .modern-marquee-container {
          min-height: 50vh;
          background: #04060f;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 40px 0;
        }

        .marquee-title {
          color: #00d4ff;
          font-size: 2.5rem;
          margin-bottom: 40px;
          text-transform: uppercase;
          letter-spacing: 4px;
          text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }

        /* حاوية الشريط */
        .marquee-window {
          width: 100%;
          overflow: hidden;
          display: flex;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }

        .marquee-track {
          display: flex;
          gap: 30px;
          padding: 20px 0;
        }

        /* كارت الأداة */
        .modern-card {
          min-width: 200px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(0, 212, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modern-card:hover {
          border: 1px solid rgba(0, 212, 255, 0.5);
          background: rgba(0, 212, 255, 0.05);
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);
        }

        .modern-card img {
          width: 100px;
          height: 100px;
          object-fit: contain;
          margin-bottom: 15px;
          filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.2));
        }

        .modern-card h3 {
          color: #fff;
          font-size: 1.1rem;
          margin: 0;
        }

        /* Modal Style */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5000;
        }

        .modal-box {
          background: #0d1530;
          padding: 40px;
          border-radius: 30px;
          border: 1px solid #00d4ff;
          text-align: center;
          max-width: 400px;
        }
      `}</style>

      <h2 className="marquee-title">Laboratory Gear</h2>

      <div className="marquee-window">
        <motion.div 
          className="marquee-track"
          animate={{
            x: [0, -1000], // يتحرك لليسار
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20, // السرعة
              ease: "linear",
            },
          }}
          whileHover={{ animationPlayState: "paused" }} // يتوقف عند مرور الماوس
        >
          {duplicatedTools.map((tool, index) => (
            <div 
              key={index} 
              className="modern-card"
              onClick={() => setSelectedTool(tool)}
            >
              <img src={tool.image} alt={tool.name} />
              <h3>{tool.name}</h3>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Popup / Modal */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div 
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTool(null)}
          >
            <motion.div 
              className="modal-box"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedTool.image} style={{width: 150}} alt="" />
              <h2 style={{color: "#00d4ff"}}>{selectedTool.name}</h2>
              <p style={{color: "#a8c0d8"}}>{selectedTool.description}</p>
              <button 
                onClick={() => setSelectedTool(null)}
                style={{
                  marginTop: 20, padding: "10px 25px", borderRadius: 20,
                  border: "none", background: "#00d4ff", cursor: "pointer"
                }}
              >Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}