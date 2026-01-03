// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/Theme";
import MainPage from "./pages/MainPage";
import ADHD_RS_IV from "./pages/ADHD_RS_IV";
import ASRS from "./pages/ASRS";
import WURS from "./pages/WURS";
import ADHD_DIVA_5 from "./pages/ADHD_DIVA_5";
import CAARS from "./pages/CAARS";
import Wechsler from "./pages/Wechsler";
import CAARS_Small from "./pages/CAARS_Small";
import CAT_Q from "./pages/CAT-Q";
import { AuthProvider } from "./hooks/AuthProvider";
import Page404 from "./pages/Page404";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/ADHD-RS-IV" element={<ADHD_RS_IV />} />
            <Route path="/ASRS_v1.1" element={<ASRS />} />
            <Route path="/WURS-25" element={<WURS />} />
            <Route path="/ADHD_DIVA_5" element={<ADHD_DIVA_5 />} />
            <Route path="/CAARS" element={<CAARS />} />
            <Route path="/Wechsler" element={<Wechsler />} />
            <Route path="/CAARS_short" element={<CAARS_Small />} />
            <Route path="/CAT-Q" element={<CAT_Q />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
