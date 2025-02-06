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
import NGODashboard from './pages/NGODashboard';
import UserDashboard from './pages/UserDashboard';
import WithdrawalRequest from './pages/WithdrawalRequest';
import HelpSupport from './pages/HelpSupport';
import Explorer from './pages/Explorer';
import TermsConditions from './pages/TermsConditions';
import AdminDash from './admin/AdminDashboard';


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
            <Route path="/ngo-dashboard" element={<NGODashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/withdrawal" element={<WithdrawalRequest />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/admin" element={<AdminDash />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;