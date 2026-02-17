
import React, { useState, useEffect } from 'react';
import { TOUR_DATES } from '../constants';
import { generateVenueHype } from '../geminiService';

const Tour: React.FC = () => {
  const [hypeMessages, setHypeMessages] = useState<Record<string, string>>({});
  const [loadingHype, setLoadingHype] = useState<string | null>(null);

  const handleGetHype = async (id: string, venue: string, city: string) => {
    if (hypeMessages[id]) return;
    setLoadingHype(id);
    const msg = await generateVenueHype(venue, city);
    setHypeMessages(prev => ({ ...prev, [id]: msg }));
    setLoadingHype(null);
  };

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-black">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-7xl font-heading mb-4 text-white">WORLD TOUR</h1>
          <p className="text-gray-500 font-heading text-sm tracking-widest">NEXT GIGS ANNOUNCEMENTS</p>
        </header>

        <div className="space-y-4">
          {TOUR_DATES.map((event) => (
            <div 
              key={event.id} 
              className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-red-600/50 transition-all"
            >
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
                  <p className="text-sm text-gray-400 italic font-light italic">
                    "{hypeMessages[event.id]}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

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
