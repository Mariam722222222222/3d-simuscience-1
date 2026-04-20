import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLoader from "./Components/PageLoader";

// --- استيرادات الفيديوهات (كما هي تماماً) ---
import video2            from "./assets/img2.mp4";
import oxidationVideo    from "./assets/oxidation.mp4";
import additionVideo     from "./assets/Addition.mp4";
import catalyticVideo    from "./assets/Catalystic.mp4";
import compositionVideo  from "./assets/Compustionofhydro.mp4";
import condensationVideo from "./assets/condinsation.mp4";
import combustionVideo   from "./assets/Combu.mp4";
import decompositionVideo    from "./assets/decomposition.mp4";
import disproportionationVideo from "./assets/desproparation.mp4";
import doubleReplacementVideo  from "./assets/doubledisplacement.mp4";
import hydrolysisVideo   from "./assets/hydro.mp4";
import neutralizationVideo from "./assets/neutrilization.mp4";
import redoxVideo        from "./assets/redox.mp4";
import singleReplacementVideo from "./assets/singlereplacement.mp4";
import photochemicalVideo from "./assets/photochemical.mp4";
import precipitationVideo from "./assets/preception.mp4";
import polymerizationVideo from "./assets/polymeriation.mp4";

/* ── hook: IntersectionObserver للأنيميشن ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── عداد الأرقام المتحرك ── */
function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [visible, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const EXPERIMENTS = [
  { video: oxidationVideo,    title: "Oxidation-Reduction",    desc: "Simultaneous oxidation and reduction.",     route: "/oxidation-reduction" },
  { video: additionVideo,     title: "Addition Reaction",      desc: "Reactants combine to a single product.",   route: "/Addition" },
  { video: catalyticVideo,    title: "Catalytic Reaction",     desc: "Accelerated by catalyst without loss.",    route: "/Catalytic" },
  { video: compositionVideo,  title: "Combustion of Hydrocarbons", desc: "Hydrocarbon + O₂ → heat & light.",   route: "/Compustionofhydro" },
  { video: condensationVideo, title: "Condensation Reaction",  desc: "Two molecules join, releasing water.",     route: "/Condinsation" },
  { video: combustionVideo,   title: "Combustion",             desc: "Substance + O₂ → heat & light.",          route: "/Cumbustion" },
  { video: decompositionVideo,title: "Decomposition",          desc: "Compound breaks into simpler substances.", route: "/Decomposition" },
  { video: disproportionationVideo, title: "Disproportionation", desc: "Element simultaneously oxidized & reduced.", route: "/Disproportionation" },
  { video: doubleReplacementVideo,  title: "Double Replacement",  desc: "Ion exchange between two compounds.",  route: "/DoubleReplacment" },
  { video: hydrolysisVideo,   title: "Hydrolysis",             desc: "Water breaks chemical bonds.",             route: "/Hydrolysis" },
  { video: neutralizationVideo, title: "Neutralization",       desc: "Acid + base → salt + water.",             route: "/Neutrlization" },
  { video: redoxVideo,        title: "Redox Reaction",         desc: "Electron transfer between substances.",    route: "/Redox" },
  { video: singleReplacementVideo, title: "Single Replacement", desc: "Element replaces another in compound.",  route: "/SingleReplacement" },
  { video: photochemicalVideo,title: "Photochemical Reaction", desc: "Reaction initiated by light energy.",      route: "/photochmical" },
  { video: precipitationVideo,title: "Precipitation Reaction", desc: "Insoluble solid from two solutions.",     route: "/preceptition" },
  { video: polymerizationVideo, title: "Polymerization",       desc: "Monomers join to form a polymer chain.",  route: "/polymerization" },
];

const REACTION_TYPES = [
  { icon: "⚡", title: "Combination",    desc: "Two or more substances combine into one product." },
  { icon: "💥", title: "Decomposition",  desc: "Single compound breaks into simpler substances." },
  { icon: "🔄", title: "Single Replace", desc: "An element replaces another in a compound." },
  { icon: "↔️", title: "Double Replace", desc: "Exchange of ions between two compounds." },
  { icon: "🔥", title: "Combustion",     desc: "Reaction with oxygen releasing energy as heat & light." },
  { icon: "⚗️", title: "Redox",          desc: "Transfer of electrons between reactants." },
];

export default function Home() {
  const navigate = useNavigate();

  const goToLab = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      const hasAccount = window.confirm("You are not logged in. Do you already have an account?");
      if (hasAccount) navigate("/login", { state: { redirectToLab: true } });
      else navigate("/register", { state: { redirectToLab: true } });
    } else {
      navigate("/LabScene");
    }
  };

  const [heroRef, heroVis] = useReveal(0.1);
  const [aboutRef, aboutVis] = useReveal(0.15);
  const [statsRef, statsVis] = useReveal(0.2);
  const [typesRef, typesVis] = useReveal(0.1);
  const [expRef, expVis] = useReveal(0.05);
  const [ctaRef, ctaVis] = useReveal(0.2);

  return (
    <PageLoader label="Loading Laboratory…">
      <div className="home-dark">
        
        {/* ══════════════════ HERO ══════════════════ */}
        <section className="hd-hero">
          <video className="hd-hero-video" src={video2} autoPlay loop muted playsInline />
          <div className="hd-hero-overlay" />
          <div className="hd-particles">
            {Array.from({length: 18}).map((_,i) => (
              <span key={i} className="hd-particle" style={{
                left: `${(i*7+5) % 95}%`,
                animationDelay: `${(i * 0.4) % 5}s`,
                animationDuration: `${6 + (i % 4)}s`,
                width:  `${4 + (i%3)*2}px`,
                height: `${4 + (i%3)*2}px`,
              }} />
            ))}
          </div>

          <div ref={heroRef} className={`hd-hero-content ${heroVis ? "reveal" : ""}`}>
            <div className="hd-hero-badge">⚗️ Virtual Chemistry Lab</div>
            <h1 className="hd-hero-title">Explore the World of<br /><span className="hd-gradient-text">Chemistry</span><br />in 3D</h1>
            <p className="hd-hero-sub">Mix compounds and discover results in real-time — a hands-on lab experience without the hazards.</p>
            <div className="hd-hero-actions">
              <button className="hd-btn-primary" onClick={goToLab}>🚀 Enter the Lab</button>
              <button className="hd-btn-ghost" onClick={() => document.getElementById("experiments").scrollIntoView({ behavior: "smooth" })}>View Experiments ↓</button>
            </div>
          </div>
          <div className="hd-scroll-hint"><span /></div>
        </section>

        {/* ══════════════════ STATS ══════════════════ */}
        <section className="hd-stats" ref={statsRef}>
          {[
            { value: 7000, suffix: "+", label: "Reactions Simulated" },
            { value: 225,  suffix: "+", label: "Unique Compounds" },
            { value: 16,   suffix: "",  label: "Experiment Types" },
            { value: 100,  suffix: "%", label: "Safe Environment" },
          ].map((s, i) => (
            <div key={i} className={`hd-stat-card ${statsVis ? "reveal" : ""}`} style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="hd-stat-num">
                {statsVis ? <Counter end={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
              </div>
              <div className="hd-stat-label">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ══════════════════ ABOUT ══════════════════ */}
        <section className="hd-about" ref={aboutRef}>
          <div className={`hd-about-text ${aboutVis ? "reveal" : ""}`}>
            <div className="hd-section-tag">About the Platform</div>
            <h2 className="hd-section-title">What is Simuscience?</h2>
            <p className="hd-about-desc">Simuscience is an interactive 3D virtual chemistry lab built for students and educators.</p>
            <ul className="hd-feature-list">
              {["🎨 Real compound colors & states", "🤖 AI-powered reaction prediction", "🧪 225+ chemical compounds", "🔬 Interactive 3D beaker simulation"].map((f, i) => (
                <li key={i} className="hd-feature-item">{f}</li>
              ))}
            </ul>
            <button className="hd-btn-primary" onClick={goToLab}>Start Experimenting →</button>
          </div>
          <div className={`hd-about-visual ${aboutVis ? "reveal-right" : ""}`}>
            <div className="hd-beaker-card">
              <div className="hd-beaker-icon">⚗️</div>
              <div className="hd-beaker-lines">
                {["Fe + O₂ → Fe₂O₃", "H₂ + Cl₂ → 2HCl", "NaOH + HCl → NaCl + H₂O"].map((eq,i) => (
                  <div key={i} className="hd-beaker-eq" style={{ animationDelay: `${i*0.6}s` }}>{eq}</div>
                ))}
              </div>
              <div className="hd-beaker-glow" />
            </div>
          </div>
        </section>

        {/* ══════════════════ REACTION TYPES ══════════════════ */}
        <section className="hd-types" ref={typesRef}>
          <div className="hd-section-header">
            <div className="hd-section-tag">Reaction Types</div>
            <h2 className="hd-section-title">6 Core Reaction Categories</h2>
          </div>
          <div className="hd-types-grid">
            {REACTION_TYPES.map((rt, i) => (
              <div key={i} className={`hd-type-card ${typesVis ? "reveal" : ""}`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className="hd-type-icon">{rt.icon}</span>
                <h3 className="hd-type-title">{rt.title}</h3>
                <p className="hd-type-desc">{rt.desc}</p>
                <div className="hd-type-line" />
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════ EXPERIMENTS (Infinite Auto-Scroll) ══════════════════ */}
        <section className="hd-experiments-infinite" id="experiments" ref={expRef}>
          <div className="hd-section-header">
            <div className="hd-section-tag">Lab Experiments</div>
            <h2 className="hd-section-title">Our Interactive Experiments</h2>
          </div>

          <div className="infinite-slider-container">
            <div className="infinite-slider-track">
              {/* تكرار العناصر مرتين لضمان حركة لا نهائية وسلسة */}
              {[...EXPERIMENTS, ...EXPERIMENTS].map((exp, i) => (
                <div key={i} className="exp-infinite-card" onClick={() => navigate(exp.route)}>
                  <video src={exp.video} autoPlay loop muted playsInline />
                  <div className="exp-infinite-overlay">
                    <div className="exp-infinite-num">{i % EXPERIMENTS.length + 1}</div>
                    <h3 className="exp-infinite-title">{exp.title}</h3>
                    <p className="exp-infinite-desc">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ CTA ══════════════════ */}
        <section className="hd-cta" ref={ctaRef}>
          <div className={`hd-cta-inner ${ctaVis ? "reveal" : ""}`}>
            <h2 className="hd-cta-title">Ready to Start Experimenting?</h2>
            <button className="hd-btn-primary hd-btn-large" onClick={goToLab}>⚗️ Open Virtual Lab</button>
          </div>
        </section>

        {/* ── CSS المدمج للتعديلات الجديدة ── */}
        <style>{`
          /* تصميم الشريط اللانهائي */
          .hd-experiments-infinite {
            padding: 80px 0 40px 0; /* تقليل المسافة السفلية */
            overflow: hidden;
            background: #060818;
          }

          .infinite-slider-container {
            width: 100%;
            overflow: hidden;
            position: relative;
            padding: 20px 0;
          }

          .infinite-slider-track {
            display: flex;
            /* عرض التراك هو (عرض الكرت + الهامش) * عدد الكروت الكلي */
            width: calc(320px * ${EXPERIMENTS.length * 2});
            animation: scroll-infinite 50s linear infinite;
          }

          /* التوقف عند الوقوف بالماوس */
          .infinite-slider-container:hover .infinite-slider-track {
            animation-play-state: paused;
          }

          .exp-infinite-card {
            width: 300px;
            height: 200px;
            margin: 0 10px;
            flex-shrink: 0;
            border-radius: 16px;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            border: 1px solid rgba(0, 212, 255, 0.2);
            transition: transform 0.3s ease, border-color 0.3s ease;
          }

          .exp-infinite-card:hover {
            transform: translateY(-8px);
            border-color: #00d4ff;
          }

          .exp-infinite-card video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .exp-infinite-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.9) 10%, transparent 70%);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 15px;
            color: white;
          }

          .exp-infinite-num {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            font-weight: 900;
            opacity: 0.2;
            color: #00d4ff;
          }

          .exp-infinite-title {
            font-size: 16px;
            margin: 0 0 5px 0;
            color: #00d4ff;
          }

          .exp-infinite-desc {
            font-size: 12px;
            margin: 0;
            opacity: 0.8;
            line-height: 1.4;
          }

          @keyframes scroll-infinite {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-320px * ${EXPERIMENTS.length})); }
          }

          /* تقليل المسافات مع الفوتر */
          .hd-cta {
            padding: 40px 20px;
            margin-bottom: 0;
          }

          /* التجاوب مع الشاشات */
          @media (max-width: 768px) {
            .exp-infinite-card {
              width: 240px;
              height: 160px;
            }
            @keyframes scroll-infinite {
              100% { transform: translateX(calc(-260px * ${EXPERIMENTS.length})); }
            }
          }
        `}</style>
      </div>
    </PageLoader>
  );
}