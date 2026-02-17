
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'text' | 'circle' | 'fusion';
}

const Logo: React.FC<LogoProps> = ({ className = "h-12", variant = 'text' }) => {
  // Nouvelle URL fournie
  const logoUrl = "https://i.postimg.cc/tghWyBgw/1000000712.png";

  if (variant === 'circle') {
    return (
      <div className={`relative ${className} aspect-square flex items-center justify-center rounded-full bg-black border border-white/10 overflow-hidden shadow-lg shadow-red-900/20 group`}>
        <img 
          src={logoUrl} 
          alt="REVALIXX" 
          className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110 group-hover:brightness-125"
        />
      </div>
    );
  }

  // Logo Fusionné (Home Page Hero) - Style Hard Techno
  if (variant === 'fusion') {
    return (
      <div className={`relative ${className} flex items-center justify-center group select-none`}>
        {/* L'image principale avec l'animation de scintillement (flicker) définie dans index.html */}
        <img 
          src={logoUrl} 
          alt="REVALIXX" 
          className="w-full h-full object-contain logo-fusion drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
        />
      </div>
    );
  }

  // Version Standard (pour la Navbar)
  return (
    <div className={`relative ${className} flex items-center justify-center group`}>
      <img 
        src={logoUrl} 
        alt="REVALIXX" 
        className="w-full h-full object-contain filter drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]"
      />
    </div>
  );
};

export default Logo;
