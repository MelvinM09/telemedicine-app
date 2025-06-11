// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage'; // your homepage component
import UserDashboard from "./pages/UserDashboard";
import Doctor_Dashboard from "./pages/Doctor_Dashboard";



const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/doctor-dashboard" element={<Doctor_Dashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />

      </Routes>
    </Router>
  );
};

export default App;
