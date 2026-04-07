import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Scanner from './pages/Scanner';
import Dashboard from './pages/Dashboard';
import CareerPaths from './pages/CareerPaths';
import JobMatch from './pages/JobMatch';
import InterviewPrep from './pages/InterviewPrep';
import SkillGap from './pages/SkillGap';
import CoverLetter from './pages/CoverLetter';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-background relative selection:bg-primary/30 selection:text-white transition-colors dark:bg-gray-900">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
    <div className="absolute inset-0 bg-gradient-premium pointer-events-none opacity-40"></div>
    <Navbar />
    <main className="flex-grow flex flex-col relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Sidebar>
      <Outlet />
    </Sidebar>
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Navbar/Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          {/* Protected Routes with Sidebar */}
          <Route element={<ProtectedLayout />}>
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/career-paths" element={<CareerPaths />} />
            <Route path="/job-match" element={<JobMatch />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            <Route path="/skill-gap" element={<SkillGap />} />
            <Route path="/cover-letter" element={<CoverLetter />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
