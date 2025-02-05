import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import MetaMaskLogin from './pages/MetaMaskLogin';
import AdminVerification from './pages/AdminVerification';
import CampaignsNGOs from './pages/CampaignsNGOs';
import CampaignDetails from './pages/CampaignDetails';
import NGORegistration from './pages/NGORegistration';


function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<MetaMaskLogin />} />
            <Route path="/admin" element={<AdminVerification />} />
            <Route path="/campaigns" element={<CampaignsNGOs />} />
            <Route path="/campaign/:id" element={<CampaignDetails />} />
            <Route path="/ngo/register" element={<NGORegistration />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;