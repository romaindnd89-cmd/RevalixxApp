
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Artists from './pages/Artists';
import VideoHub from './pages/VideoHub';
import Tour from './pages/Tour';
import Gallery from './pages/Gallery';

const App: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('revalixx_admin_active');
    window.location.reload();
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-black overflow-x-hidden">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/videos" element={<VideoHub />} />
            <Route path="/tour" element={<Tour />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>
        
        <footer className="py-12 px-4 glass-card border-x-0 border-b-0">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-2xl font-bold font-heading tracking-tighter text-white">REVALIXX</span>
              <p className="text-[10px] text-gray-500 font-heading mt-2 uppercase tracking-[0.3em]">
                HARD MUSIC COLLECTIVE & LABEL
              </p>
              {localStorage.getItem('revalixx_admin_active') === 'true' && (
                <button 
                  onClick={handleLogout}
                  className="text-[8px] text-red-600 font-heading mt-4 hover:underline"
                >
                  DECONNEXION ADMIN
                </button>
              )}
            </div>
            
            {/* Correction responsive : flex-wrap + gap au lieu de space-x fixe */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:gap-8 text-[10px] font-heading tracking-widest text-gray-400 w-full md:w-auto">
              <a href="https://instagram.com/revalixxoff" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">INSTAGRAM</a>
              <a href="#" className="hover:text-white transition-colors">SOUNDCLOUD</a>
              <a href="#" className="hover:text-white transition-colors">YOUTUBE</a>
              <a href="#" className="hover:text-white transition-colors">SPOTIFY</a>
            </div>
            
            <div className="text-[10px] font-heading text-gray-600 text-center md:text-right">
              © 2024 REVALIXX RECORDS. ALL RIGHTS RESERVED.<br/>
              <span className="text-[8px] opacity-30 italic">Developed for Alixx & DJ Revaxx</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
