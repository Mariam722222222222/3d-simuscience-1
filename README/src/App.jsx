import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

import NavBar from "./assets/NavBar";
import Footer from "./assets/Footer";

import Home from "./Home";
import Lab from "./assets/Lab";
import Elements from "./assets/Elements";
import Login from "./assets/Login";
import Register from "./assets/Register";
import UserProfile from "./assets/UserProfile";
import ChemistryLab from "./assets/chemistryLab";
import ChemicalTools from "./assets/ChemicalTools";
import Review from "./assets/Review";
import UserDashboard from "./assets/UserDashbord";
import compination from "./assets/compination";
 import LabScene from "./Components/LabScene";
import ExperimentsHistory from "./Components/ExperimentsHistory";
 
// Experiments Pages
import OxidationReduction from "./assets/Oxide";
import Addition from "./assets/Addition";
import Catalytic from "./assets/Catalytic";
import Compustionofhydro from "./assets/Compustionofhydro";
import Condinsation from "./assets/Condinsation";
import Cumbustion from "./assets/Cumbustion";
import Decomposition from "./assets/Decomposition";
import Disproportionation from "./assets/Disproportionation";
import DoubleReplacment from "./assets/DoubleReplacment";
import Hydrolysis from "./assets/Hydrolysis";
import Neutrlization from "./assets/Neutrlization";
import Redox from "./assets/Redox";
import SingleReplacement from "./assets/SingleReplacement";
import PhotoChemical from "./assets/photochmical";
import Precipitation from "./assets/preceptition";
import Polymerization from "./assets/polymerization";
import AcideBasereaction from "./assets/AcideBasereaction";
import Combination from "./assets/compination";
import Electrolysis from "./assets/Electrolysis";
import Substiution from "./assets/Substiution";
import ReactionCatalog from "./Components/reactionCatalog";

import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    document.body.className = theme;
    document.body.dir = language === "ar" ? "rtl" : "ltr";
  }, [theme, language]);

  return (
    <Router>
      <NavBar
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
      />

      <Routes>
        <Route path="/" element={<Home />} />
  <Route
  path="/LabScene"
  element={
    <div className="lab-page">
      <LabScene />
    </div>
  }
/>
         <Route path="/ExperimentsHistory" element={<ExperimentsHistory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/review" element={<Review />} />
        <Route path="/ChemicalTools" element={<ChemicalTools />} />

        <Route path="/oxidation-reduction" element={<OxidationReduction />} />
        <Route path="/Addition" element={<Addition />} />
        <Route path="/Catalytic" element={<Catalytic />} />
        <Route path="/Compustionofhydro" element={<Compustionofhydro />} />
        <Route path="/Condinsation" element={<Condinsation />} />
        <Route path="/Cumbustion" element={<Cumbustion />} />
        <Route path="/Decomposition" element={<Decomposition />} />
        <Route path="/Disproportionation" element={<Disproportionation />} />
        <Route path="/DoubleReplacment" element={<DoubleReplacment />} />
        <Route path="/Hydrolysis" element={<Hydrolysis />} />
        <Route path="/Neutrlization" element={<Neutrlization />} />
        <Route path="/Redox" element={<Redox />} />
        <Route path="/SingleReplacement" element={<SingleReplacement />} />
        <Route path="/photochmical" element={<PhotoChemical />} />
        <Route path="/preceptition" element={<Precipitation />} />
        <Route path="/polymerization" element={<Polymerization />} />
        <Route path="/AcideBasereaction" element={<AcideBasereaction />} />
        <Route path="/Electrolysis" element={<Electrolysis />} />
        <Route path="/Substiution" element={<Substiution />} />
        <Route path="/catalog" element={<ReactionCatalog />} />

        <Route path="/compination" element={<compination />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;