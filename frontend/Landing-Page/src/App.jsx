import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Landing/Home";
import About from "./pages/Landing/About";
import Services from "./pages/Landing/Services";
import Contact from "./pages/Landing/Contact";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import TermsOfUse from "./pages/Legal/TermsOfUse";
import LegalNotice from "./pages/Legal/LegalNotice";
import PublicLayout from "./components/layouts/PublicLayout";
import ScrollToTop from "./components/ScrollToTop";

import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes avec Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
          </Route>
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
};

export default App;
