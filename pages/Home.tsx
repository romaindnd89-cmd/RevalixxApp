
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOUR_DATES } from '../constants'; // Fallback
import { subscribeToTourDates, addTourDateToDb } from '../services/firebase';
import { TourDate } from '../types';
import Logo from '../components/Logo';

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  // Gestion de l'admin
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Gestion des dates
  const [allDates, setAllDates] = useState<TourDate[]>([]);
  const [nextGig, setNextGig] = useState<TourDate | null>(null);

  // Modal Ajout Date
  const [isGigModalOpen, setIsGigModalOpen] = useState(false);
  const [newVenue, setNewVenue] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('FR');
  const [newDate, setNewDate] = useState('');
  const [newStatus, setNewStatus] = useState('Tickets');

  // Config Live (LocalStorage)
  const [liveConfig, setLiveConfig] = useState({ active: false, text: 'THE REVALIXX TAKEOVER', url: '' });

  // Effets visuels
  const [isGlitching, setIsGlitching] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    // 1. Check Admin
    const adminStatus = localStorage.getItem('revalixx_admin_active');
    if (adminStatus === 'true') setIsAdmin(true);

    // 2. Load Live Config
    const savedLive = localStorage.getItem('revalixx_live_config');
    if (savedLive) {
      setLiveConfig(JSON.parse(savedLive));
    }

    // 3. Subscribe to Tour Dates (Firebase)
    const unsubscribe = subscribeToTourDates((firebaseDates) => {
      // Fusionner avec les dates statiques si besoin, ou utiliser uniquement Firebase
      // Pour l'instant, on utilise Firebase + Constants si Firebase vide (pour la démo initiale)
      let combined = [...firebaseDates];
      if (combined.length === 0) {
        combined = [...TOUR_DATES];
      }

      setAllDates(combined);

      // Trouver la prochaine date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = combined
        .filter(d => new Date(d.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (upcoming.length > 0) {
        setNextGig(upcoming[0]);
      } else {
        setNextGig(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- HANDLERS D'EFFETS ---

  const handleEnterVoid = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsGlitching(true);
    setTimeout(() => {
        navigate('/gallery');
    }, 2600); 
  };

  const handleVideoTransmission = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExploding(true);
    setTimeout(() => {
      navigate('/videos');
    }, 1900); 
  };

  // --- GESTION GIGS (ADD ONLY) ---

  const handleAddGig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenue || !newCity || !newDate) return;

    try {
      await addTourDateToDb({
        venue: newVenue,
        city: newCity,
        country: newCountry,
        date: newDate,
        status: newStatus
      });
      setIsGigModalOpen(false);
      // Reset form
      setNewVenue('');
      setNewCity('');
      setNewDate('');
    } catch (err) {
      alert("Error saving date. Check console.");
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      
      {/* 1. HORROR TV OVERLAY (VOID) */}
      {isGlitching && (
        <div className="horror-tv-container">
            <div className="tv-vignette"></div>
            <div className="tv-static-horror"></div>
            <div className="horror-flash-overlay"></div>
            <div className="horror-logo-wrapper">
                <img 
                    src="https://i.postimg.cc/tghWyBgw/1000000712.png" 
                    alt="REVALIXX" 
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
      )}

      {/* 2. CHAOS LIGHTNING OVERLAY (VIDEOS) */}
      {isExploding && (
        <div className="chaos-container">
           <div className="bolt-center"></div>
           <div className="lightning-bolt bolt-1"></div>
           <div className="lightning-bolt bolt-2"></div>
           <div className="lightning-bolt bolt-3"></div>
           <div className="chaos-explosion"></div>
           <div className="chaos-logo-target">
              <img 
                src="https://i.postimg.cc/tghWyBgw/1000000712.png" 
                alt="REVALIXX" 
                className="w-full h-full object-contain"
              />
           </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614332287897-79a74d393487?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-40 contrast-125" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-7xl w-full flex flex-col items-center">
          {liveConfig.active ? (
            <a 
              href={liveConfig.url || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-4 py-1 border border-red-600 text-red-600 text-[10px] font-heading tracking-[0.4em] mb-8 animate-pulse hover:bg-red-600 hover:text-white transition-all cursor-pointer bg-black"
            >
              NOW LIVE: {liveConfig.text.toUpperCase()}
            </a>
          ) : (
            <div className="inline-block px-3 py-1 border-t border-b border-white/10 text-gray-500 text-[10px] font-heading tracking-[0.6em] mb-12 uppercase">
              Underground Resistance
            </div>
          )}
          
          {/* LE LOGO */}
          <div className="mb-16 relative w-72 md:w-[500px] aspect-video flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-red-900/20 blur-[100px] rounded-full animate-pulse pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-white/5 blur-[50px] rounded-full pointer-events-none"></div>
            <Logo className="w-full h-full relative z-10" variant="fusion" />
          </div>

          <p className="text-xs md:text-lg text-gray-500 font-light tracking-[0.4em] md:tracking-[0.6em] mb-16 uppercase font-heading text-center leading-loose">
            Hard Techno <span className="text-red-900 mx-2">•</span> Raw <span className="text-red-900 mx-2">•</span> Hardcore <span className="text-red-900 mx-2">•</span> Uptempo
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-md">
            <button 
              onClick={handleEnterVoid}
              className="w-full group relative px-8 py-4 bg-white text-black font-heading text-xs tracking-widest overflow-hidden transition-all hover:bg-red-600 hover:text-white"
            >
              <span className="relative z-10 flex justify-center items-center w-full font-bold">
                ENTER THE VOID
              </span>
            </button>
            <button 
              onClick={handleVideoTransmission}
              className="w-full px-8 py-4 border border-white/10 text-gray-400 font-heading text-xs tracking-widest hover:border-white hover:text-white transition-all text-center"
            >
              VIDEO TRANSMISSIONS
            </button>
          </div>
        </div>

        {/* Floating Next Gig Banner - ONLY THE IMMEDIATE NEXT ONE */}
        <div className="absolute bottom-10 left-0 w-full flex flex-col items-center justify-center z-20 px-4 gap-2">
            {nextGig ? (
                <div 
                    onClick={() => navigate('/tour')}
                    className="group relative cursor-pointer overflow-hidden border border-red-900/40 bg-black/60 backdrop-blur-md px-8 py-3 transition-all hover:border-red-600 hover:bg-red-900/20"
                >
                    {/* Visual Pulse Effect */}
                    <div className="absolute inset-0 bg-red-600/10 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-red-600 animate-[scanline_2s_linear_infinite]"></div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-1">
                        <span className="text-[9px] text-red-500 font-heading tracking-[0.3em] uppercase animate-pulse">
                            /// NEXT MISSION TARGET LOCKED ///
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="text-white font-bold font-heading text-lg uppercase tracking-wider group-hover:text-red-500 transition-colors">
                                {nextGig.city}
                            </span>
                            <span className="text-gray-500 text-xs">|</span>
                            <span className="text-gray-300 font-heading text-xs uppercase tracking-widest">
                                {nextGig.venue}
                            </span>
                            <span className="text-gray-500 text-xs">|</span>
                            <span className="text-red-600 font-heading text-xs uppercase">
                                {new Date(nextGig.date).toLocaleDateString(undefined, {day: '2-digit', month: '2-digit'})}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-[10px] text-gray-600 font-heading tracking-widest uppercase">
                    NO UPCOMING MISSIONS DETECTED
                </div>
            )}
            
            {isAdmin && (
                <button 
                    onClick={() => setIsGigModalOpen(true)}
                    className="mt-2 text-[8px] text-red-600 border border-red-900/30 px-3 py-1 uppercase tracking-widest hover:bg-red-900/20 transition-colors bg-black"
                >
                    + ADD NEW TOUR DATE
                </button>
            )}
        </div>
      </section>

      {/* Add Gig Modal */}
      {isGigModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsGigModalOpen(false)}></div>
            <div className="relative w-full max-w-md glass-card p-8 border-t-2 border-t-red-600">
              <h2 className="text-xl font-heading mb-6 italic text-center text-white">ADD MISSION TO DATABASE</h2>
              <form onSubmit={handleAddGig} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-heading tracking-widest text-gray-500 mb-1">DATE</label>
                  <input 
                    type="date" 
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-red-600 outline-none uppercase"
                  />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-[10px] font-heading tracking-widest text-gray-500 mb-1">CITY</label>
                        <input 
                            type="text" 
                            required
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-red-600 outline-none uppercase"
                            placeholder="PARIS"
                        />
                    </div>
                    <div className="w-20">
                        <label className="block text-[10px] font-heading tracking-widest text-gray-500 mb-1">CTRY</label>
                        <input 
                            type="text" 
                            required
                            value={newCountry}
                            onChange={(e) => setNewCountry(e.target.value)}
                            className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-red-600 outline-none uppercase"
                            placeholder="FR"
                        />
                    </div>
                </div>
                <div>
                  <label className="block text-[10px] font-heading tracking-widest text-gray-500 mb-1">VENUE / EVENT</label>
                  <input 
                    type="text" 
                    required
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-red-600 outline-none uppercase"
                    placeholder="WAREHOUSE"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-heading tracking-widest text-gray-500 mb-1">STATUS</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-red-600 outline-none uppercase"
                  >
                      <option value="Tickets">TICKETS AVAILABLE</option>
                      <option value="Sold Out">SOLD OUT</option>
                      <option value="Soon">COMING SOON</option>
                  </select>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsGigModalOpen(false)} className="flex-1 py-3 border border-white/10 text-gray-500 font-heading text-[10px] tracking-widest hover:text-white">CANCEL</button>
                  <button type="submit" className="flex-1 py-3 bg-red-600 text-white font-heading text-[10px] tracking-widest hover:bg-red-700">CONFIRM UPLOAD</button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Manifesto Section */}
      <section className="py-32 px-6 bg-black">
        <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-8 leading-tight text-white/90">
              NO COMPROMISE. <br/><span className="text-red-700 blur-[1px]">JUST VIOLENCE.</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-body leading-relaxed max-w-2xl mx-auto tracking-wide">
              Revalixx stands at the intersection of industrial noise and rhythmic precision. 
              We curate the sounds that thrive in darkness.
            </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
