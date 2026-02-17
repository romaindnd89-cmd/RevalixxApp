
import React from 'react';
import { ARTISTS } from '../constants';
import Logo from '../components/Logo';

const Artists: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center">
          <h1 className="text-6xl md:text-9xl font-heading font-black tracking-tighter italic opacity-20 absolute left-1/2 -translate-x-1/2 -translate-y-12 select-none pointer-events-none uppercase">THE CORE</h1>
          <h2 className="text-4xl md:text-6xl font-heading font-bold relative z-10 uppercase">THE ARCHITECTS</h2>
          <div className="h-1 w-20 bg-red-600 mx-auto mt-4"></div>
        </header>
        
        <div className="grid md:grid-cols-2 gap-20">
          {ARTISTS.map((artist) => (
            <div key={artist.name} className="group">
              <div className="relative mb-10 overflow-hidden aspect-[4/5] border border-white/5 bg-[#0a0a0a]">
                <img 
                  src={artist.imageUrl} 
                  alt={artist.name} 
                  className="w-full h-full object-cover grayscale transition-all duration-[1.5s] filter contrast-125 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute top-6 right-6">
                  <LogoMark />
                </div>
                <div className="absolute bottom-10 left-10">
                   <span className="text-red-600 font-heading text-xs tracking-widest block mb-2 uppercase">{artist.role}</span>
                   <h3 className="text-5xl font-heading font-black italic uppercase">{artist.name}</h3>
                </div>
              </div>
              
              <div className="px-2">
                <p className="text-gray-400 font-body text-lg leading-relaxed mb-8">
                  {artist.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href={`https://instagram.com/${artist.instagram}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-3 px-6 py-4 bg-white text-black font-heading text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all uppercase"
                  >
                    <span>FOLLOW @{artist.instagram.toUpperCase()}</span>
                  </a>
                  <button className="px-6 py-4 border border-white/10 text-white font-heading text-[10px] tracking-widest hover:border-white transition-all uppercase">
                    LATEST SETS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LogoMark = () => (
  <div className="w-16 h-16 flex items-center justify-center border border-white/10 bg-black/60 backdrop-blur-lg rounded-full overflow-hidden hover:border-red-600 transition-colors group-hover:rotate-12 transition-transform duration-500">
    <Logo variant="circle" className="h-10" />
  </div>
);

export default Artists;
