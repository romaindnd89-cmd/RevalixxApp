
import React, { useState, useEffect } from 'react';
import { TOUR_DATES } from '../constants';
import { generateVenueHype } from '../geminiService';
import { subscribeToTourDates, deleteTourDateFromDb } from '../services/firebase';
import { TourDate } from '../types';

const Tour: React.FC = () => {
  const [dates, setDates] = useState<TourDate[]>([]);
  const [hypeMessages, setHypeMessages] = useState<Record<string, string>>({});
  const [loadingHype, setLoadingHype] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check Admin
    const adminStatus = localStorage.getItem('revalixx_admin_active');
    if (adminStatus === 'true') setIsAdmin(true);

    // Subscribe to Firebase
    const unsubscribe = subscribeToTourDates((firebaseDates) => {
        let combined = [...firebaseDates];
        if (combined.length === 0) {
            combined = [...TOUR_DATES];
        }
        // Trier par date
        combined.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setDates(combined);
    });

    return () => unsubscribe();
  }, []);

  const handleGetHype = async (id: string, venue: string, city: string) => {
    if (hypeMessages[id]) return;
    setLoadingHype(id);
    const msg = await generateVenueHype(venue, city);
    setHypeMessages(prev => ({ ...prev, [id]: msg }));
    setLoadingHype(null);
  };

  const handleDelete = async (id: string) => {
      if(!window.confirm("DELETE THIS DATE?")) return;
      try {
          await deleteTourDateFromDb(id);
      } catch(e) {
          console.error("Delete failed", e);
      }
  };

  // Séparation Passé / Futur
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const upcomingDates = dates.filter(d => new Date(d.date) >= today);
  const pastDates = dates.filter(d => new Date(d.date) < today).reverse(); // Le plus récent passé en premier

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-black">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-7xl font-heading mb-4 text-white">WORLD TOUR</h1>
          <p className="text-gray-500 font-heading text-sm tracking-widest">SCHEDULE & HISTORY</p>
        </header>

        {/* UPCOMING */}
        {upcomingDates.length > 0 && (
            <div className="mb-20">
                <h2 className="text-red-600 font-heading text-xl mb-6 tracking-widest uppercase border-b border-red-900/30 pb-2">UPCOMING MISSIONS</h2>
                <div className="space-y-4">
                {upcomingDates.map((event) => (
                    <div 
                    key={event.id} 
                    className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-red-600/50 transition-all relative"
                    >
                    {isAdmin && !(!event.id.toString().includes('firebase') && !event.id.toString().startsWith('local')) && ( // Uniquement supprimable si dynamique (pas constante)
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-600 p-2"
                         >
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                         </button>
                    )}

                    <div className="flex items-center space-x-6 mb-4 md:mb-0">
                        <div className="text-center min-w-[60px]">
                        <span className="block text-2xl font-heading font-bold">{new Date(event.date).getDate()}</span>
                        <span className="block text-[10px] font-heading text-gray-500 uppercase">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        </div>
                        <div className="h-10 w-[1px] bg-gray-800"></div>
                        <div>
                        <h3 className="text-lg font-heading font-bold group-hover:text-red-500 transition-colors">
                            {event.venue}
                        </h3>
                        <p className="text-sm text-gray-500 uppercase tracking-widest">
                            {event.city}, {event.country}
                        </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end w-full md:w-auto">
                        <button
                        onClick={() => handleGetHype(event.id, event.venue, event.city)}
                        className={`text-[9px] font-heading tracking-widest mb-4 hover:text-white transition-colors ${hypeMessages[event.id] ? 'text-red-500' : 'text-gray-600'}`}
                        >
                        {loadingHype === event.id ? 'GENERATING ENERGY...' : hypeMessages[event.id] ? 'INFO LOADED' : 'GET INTEL'}
                        </button>
                        
                        <button 
                        disabled={event.status === 'Sold Out'}
                        className={`w-full md:w-32 py-3 font-heading text-[10px] tracking-widest border transition-all ${
                            event.status === 'Sold Out' 
                            ? 'border-gray-800 text-gray-700 cursor-not-allowed'
                            : 'border-white bg-white text-black hover:bg-red-600 hover:border-red-600 hover:text-white'
                        }`}
                        >
                        {event.status.toUpperCase()}
                        </button>
                    </div>

                    {hypeMessages[event.id] && (
                        <div className="w-full mt-6 pt-6 border-t border-gray-900 animate-in fade-in slide-in-from-top-4 duration-500">
                        <p className="text-sm text-gray-400 italic font-light">
                            "{hypeMessages[event.id]}"
                        </p>
                        </div>
                    )}
                    </div>
                ))}
                </div>
            </div>
        )}

        {/* PAST */}
        {pastDates.length > 0 && (
            <div>
                 <h2 className="text-gray-600 font-heading text-xl mb-6 tracking-widest uppercase border-b border-gray-900/30 pb-2">MISSION ARCHIVE</h2>
                 <div className="space-y-2 opacity-50 hover:opacity-100 transition-opacity duration-500">
                    {pastDates.map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-4 border border-white/5 bg-black/50">
                             <div className="flex items-center gap-4">
                                <span className="text-gray-600 font-heading text-xs w-24 line-through decoration-red-900">
                                    {new Date(event.date).toLocaleDateString()}
                                </span>
                                <div>
                                    <span className="text-gray-400 font-heading text-sm uppercase">{event.city}</span>
                                    <span className="text-gray-700 text-xs mx-2">/</span>
                                    <span className="text-gray-600 text-xs uppercase">{event.venue}</span>
                                </div>
                             </div>
                             <span className="text-[9px] text-red-900 border border-red-900/30 px-2 py-1 uppercase tracking-widest">COMPLETED</span>
                        </div>
                    ))}
                 </div>
            </div>
        )}

        <div className="mt-20 text-center">
          <p className="text-gray-600 font-heading text-[10px] tracking-widest mb-4">WANT TO BOOK REVALIXX?</p>
          <a href="mailto:booking@revalixx.com" className="text-white font-heading text-sm border-b-2 border-red-600 pb-1 hover:text-red-500 transition-all">
            BOOKING@REVALIXX.COM
          </a>
        </div>
      </div>
    </div>
  );
};

export default Tour;
