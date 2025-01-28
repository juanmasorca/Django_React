import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import AdminDashboard from "./components/AdminDashboard";
import RegularDashboard from "./components/RegularDashboard";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/regular-dashboard" element={<RegularDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
