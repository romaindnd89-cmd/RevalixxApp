
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TOUR_DATES } from '../constants';
import Logo from '../components/Logo';

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  // Gestion de l'admin et du prochain concert
  const [isAdmin, setIsAdmin] = useState(false);
  const [customGig, setCustomGig] = useState<{city: string, venue: string} | null>(null);
  const [isGigModalOpen, setIsGigModalOpen] = useState(false);
  
  // États formulaire édition concert
  const [editCity, setEditCity] = useState('');
  const [editVenue, setEditVenue] = useState('');

  // Config Live
  const [liveConfig, setLiveConfig] = useState({ active: false, text: 'THE REVALIXX TAKEOVER', url: '' });

  // État pour l'effet de glitch/transition (VOID)
  const [isGlitching, setIsGlitching] = useState(false);

  // État pour l'effet de Chaos Lightning (VIDEO)
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    // 1. Check Admin
    const adminStatus = localStorage.getItem('revalixx_admin_active');
    if (adminStatus === 'true') setIsAdmin(true);

    // 2. Load Live Config (Safe)
    try {
        const savedLive = localStorage.getItem('revalixx_live_config');
        if (savedLive) {
          setLiveConfig(JSON.parse(savedLive));
        }
    } catch (e) { console.error("Error loading live config", e); }

    // 3. Load Custom Next Gig (Safe)
    try {
        const savedGig = localStorage.getItem('revalixx_next_gig');
        if (savedGig) {
          setCustomGig(JSON.parse(savedGig));
        }
    } catch (e) { console.error("Error loading custom gig", e); }
  }, []);

  // --- HANDLERS D'EFFETS ---

  const handleEnterVoid = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsGlitching(true);
    // Déclenchement de la navigation après l'effet film d'horreur + extinction TV
    setTimeout(() => {
        navigate('/gallery');
    }, 2600); 
  };

  const handleVideoTransmission = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExploding(true);
    // Déclenchement de la navigation après l'explosion électrique (1.9s)
    setTimeout(() => {
      navigate('/videos');
    }, 1900); 
  };

  // --- GESTION GIGS ---

  // Déterminer quel concert afficher (Custom ou le premier de la liste par défaut)
  const displayGig = customGig || (TOUR_DATES.length > 0 ? { city: TOUR_DATES[0].city, venue: TOUR_DATES[0].venue } : null);

  const handleSaveGig = (e: React.FormEvent) => {
    e.preventDefault();
    const newGig = { city: editCity, venue: editVenue };
    setCustomGig(newGig);
    localStorage.setItem('revalixx_next_gig', JSON.stringify(newGig));
    setIsGigModalOpen(false);
  };

  const handleResetGig = () => {
    if(window.confirm("RESET TO DEFAULT TOUR SCHEDULE?")) {
        setCustomGig(null);
        localStorage.removeItem('revalixx_next_gig');
        setIsGigModalOpen(false);
    }
  };

  // Pré-remplir le formulaire à l'ouverture
  const openGigModal = () => {
    if (displayGig) {
        setEditCity(displayGig.city);
        setEditVenue(displayGig.venue);
    }
    setIsGigModalOpen(true);
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

      {/* 2. CHAOS LIGHTNING OVERLAY (VIDEOS) - NOUVEAU */}
      {isExploding && (
        <div className="chaos-container">
           {/* Storm Background */}
           <div className="bolt-center"></div>

           {/* Lightning Bolts */}
           <div className="lightning-bolt bolt-1"></div>
           <div className="lightning-bolt bolt-2"></div>
           <div className="lightning-bolt bolt-3"></div>

           {/* Explosion finale */}
           <div className="chaos-explosion"></div>

           {/* Logo Target */}
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
        {/* Cinematic Background - HARD TECHNO / WAREHOUSE / BLACK */}
        <div className="absolute inset-0 z-0">
          {/* Fond texturé noir (Smoke/Concrete) */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614332287897-79a74d393487?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-40 contrast-125" />
          
          {/* Vignette très prononcée pour focaliser sur le centre */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]" />
          
          {/* Scanlines pour l'effet industriel */}
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
          
          {/* LE LOGO AVEC EFFET FUSION SOMBRE */}
          {/* Le container permet de centrer et de donner l'échelle */}
          <div className="mb-16 relative w-72 md:w-[500px] aspect-video flex items-center justify-center">
            {/* Source de lumière derrière le logo (Fusion) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-red-900/20 blur-[100px] rounded-full animate-pulse pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-white/5 blur-[50px] rounded-full pointer-events-none"></div>
            
            {/* Le Logo lui-même */}
            <Logo className="w-full h-full relative z-10" variant="fusion" />
          </div>

          <p className="text-xs md:text-lg text-gray-500 font-light tracking-[0.4em] md:tracking-[0.6em] mb-16 uppercase font-heading text-center leading-loose">
            Hard Techno <span className="text-red-900 mx-2">•</span> Raw <span className="text-red-900 mx-2">•</span> Hardcore <span className="text-red-900 mx-2">•</span> Uptempo
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-md">
            {/* Bouton ENTER THE VOID (Red Glitch) */}
            <button 
              onClick={handleEnterVoid}
              className="w-full group relative px-8 py-4 bg-white text-black font-heading text-xs tracking-widest overflow-hidden transition-all hover:bg-red-600 hover:text-white"
            >
              <span className="relative z-10 flex justify-center items-center w-full font-bold">
                ENTER THE VOID
              </span>
            </button>
            
            {/* Bouton VIDEO TRANSMISSIONS (Cyan Uplink) */}
            <button 
              onClick={handleVideoTransmission}
              className="w-full px-8 py-4 border border-white/10 text-gray-400 font-heading text-xs tracking-widest hover:border-white hover:text-white transition-all text-center"
            >
              VIDEO TRANSMISSIONS
            </button>
          </div>
        </div>

        {/* Floating Next Gig Banner - Admin Editable */}
        {displayGig && (
          <div className="absolute bottom-10 left-0 w-full flex flex-col items-center justify-center z-20 px-4 gap-2">
            <div className="flex items-center space-x-4 text-[10px] font-heading tracking-widest text-gray-500 border-b border-white/10 pb-2 hover:text-white hover:border-red-600 transition-colors cursor-pointer">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              <span className="uppercase">NEXT: {displayGig.city} — {displayGig.venue}</span>
            </div>
            
            {isAdmin && (
                <button 
                    onClick={openGigModal}
                    className="text-[8px] text-red-600 border border-red-900/30 px-2 py-1 uppercase tracking-widest hover:bg-red-900/20 transition-colors"
                >
                    [ EDIT TARGET ]
                </button>
            )}
          </div>
        )}
      </section>

      {/* Edit Gig Modal */}
      {isGigModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsGigModalOpen(false)}></div>
            <div className="relative w-full max-w-md glass-card p-8 border-t-2 border-t-red-600">
              <h2 className="text-xl font-heading mb-6 italic text-center text-white">UPDATE NEXT MISSION</h2>
              <form onSubmit={handleSaveGig} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-heading tracking-widest text-gray-500 mb-2">CITY / LOCATION</label>
                  <input 
                    type="text" 
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-red-600 outline-none uppercase"
                    placeholder="e.g. BERLIN"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-heading tracking-widest text-gray-500 mb-2">VENUE / EVENT NAME</label>
                  <input 
                    type="text" 
                    required
                    value={editVenue}
                    onChange={(e) => setEditVenue(e.target.value)}
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-red-600 outline-none uppercase"
                    placeholder="e.g. VERKNIOLT"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={handleResetGig} className="flex-1 py-3 border border-red-900/50 text-red-700 font-heading text-[10px] tracking-widest hover:bg-red-900/10">RESET DEFAULT</button>
                  <button type="submit" className="flex-1 py-3 bg-red-600 text-white font-heading text-[10px] tracking-widest hover:bg-red-700">UPDATE</button>
                </div>
              </form>
              <button onClick={() => setIsGigModalOpen(false)} className="w-full mt-4 text-[9px] text-gray-600 hover:text-white font-heading uppercase">CANCEL</button>
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