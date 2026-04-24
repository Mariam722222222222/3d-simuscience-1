import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

import NavBar from "./assets/NavBar";
import Footer from "./assets/Footer";

import Home from "./Home";
import Lab from "./assets/Lab";
import Elements from "./assets/Elements";
import Login from "./assets/Login";
import Register from "./assets/Register";
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

import ProtectedRoute from "./components/ProtectedRoute";

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

        {/* 🏠 Home (مفتوحة) */}
        <Route path="/" element={<Home />} />

        {/* 🔐 Protected Routes */}

        <Route
          path="/LabScene"
          element={
            <ProtectedRoute>
              <div className="lab-page">
                <LabScene />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ExperimentsHistory"
          element={
            <ProtectedRoute>
              <ExperimentsHistory />
            </ProtectedRoute>
          }
        />


        <Route
          path="/review"
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ChemicalTools"
          element={
            <ProtectedRoute>
              <ChemicalTools />
            </ProtectedRoute>
          }
        />

        <Route
          path="/oxidation-reduction"
          element={
            <ProtectedRoute>
              <OxidationReduction />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Addition"
          element={
            <ProtectedRoute>
              <Addition />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Catalytic"
          element={
            <ProtectedRoute>
              <Catalytic />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Compustionofhydro"
          element={
            <ProtectedRoute>
              <Compustionofhydro />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Condinsation"
          element={
            <ProtectedRoute>
              <Condinsation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Cumbustion"
          element={
            <ProtectedRoute>
              <Cumbustion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Decomposition"
          element={
            <ProtectedRoute>
              <Decomposition />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Disproportionation"
          element={
            <ProtectedRoute>
              <Disproportionation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/DoubleReplacment"
          element={
            <ProtectedRoute>
              <DoubleReplacment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Hydrolysis"
          element={
            <ProtectedRoute>
              <Hydrolysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Neutrlization"
          element={
            <ProtectedRoute>
              <Neutrlization />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Redox"
          element={
            <ProtectedRoute>
              <Redox />
            </ProtectedRoute>
          }
        />

        <Route
          path="/SingleReplacement"
          element={
            <ProtectedRoute>
              <SingleReplacement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/photochmical"
          element={
            <ProtectedRoute>
              <PhotoChemical />
            </ProtectedRoute>
          }
        />

        <Route
          path="/preceptition"
          element={
            <ProtectedRoute>
              <Precipitation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/polymerization"
          element={
            <ProtectedRoute>
              <Polymerization />
            </ProtectedRoute>
          }
        />

        <Route
          path="/AcideBasereaction"
          element={
            <ProtectedRoute>
              <AcideBasereaction />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Electrolysis"
          element={
            <ProtectedRoute>
              <Electrolysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Substiution"
          element={
            <ProtectedRoute>
              <Substiution />
            </ProtectedRoute>
          }
        />

        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <ReactionCatalog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/compination"
          element={
            <ProtectedRoute>
              <compination />
            </ProtectedRoute>
          }
        />

        {/* 🔓 Login/Register (بدون حماية) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>

      <Footer />
    </Router>
  );
}

export default App;