import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import MapPage from './pages/Map';
import ReportBarrier from './pages/ReportBarrier';
import MyReports from './pages/MyReports';
import PlaceDetails from './pages/PlaceDetails';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/report" element={<ReportBarrier />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/places/:id" element={<PlaceDetails />} />
            <Route path="/place-details" element={<PlaceDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
