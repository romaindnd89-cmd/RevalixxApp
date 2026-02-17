
import React, { useState, useEffect } from 'react';
import { GALLERY_IMAGES } from '../constants';
import { GalleryImage } from '../types';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // États pour le modal de login
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // États pour l'upload
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  // Chargement des données au démarrage
  useEffect(() => {
    // Vérifier si admin est déjà loggé
    const adminStatus = localStorage.getItem('revalixx_admin_active');
    if (adminStatus === 'true') setIsAdmin(true);

    // Charger les images
    try {
      // 1. Charger les images custom (ajoutées par l'admin)
      const savedCustomImages = localStorage.getItem('revalixx_custom_images');
      let customImages: GalleryImage[] = [];
      if (savedCustomImages) {
        const parsed = JSON.parse(savedCustomImages);
        if (Array.isArray(parsed)) customImages = parsed;
      }

      // 2. Charger la blacklist des images par défaut supprimées
      const deletedDefaultsStr = localStorage.getItem('revalixx_deleted_defaults');
      let deletedIds: string[] = [];
      if (deletedDefaultsStr) {
        deletedIds = JSON.parse(deletedDefaultsStr);
      }

      // 3. Filtrer les images par défaut pour exclure celles supprimées
      // On convertit les IDs en String pour éviter les erreurs de type
      const visibleDefaults = GALLERY_IMAGES.filter(img => !deletedIds.includes(String(img.id)));

      // 4. Combiner (Custom en premier)
      setImages([...customImages, ...visibleDefaults]);

    } catch (e) {
      console.error("Error loading gallery data", e);
      setImages(GALLERY_IMAGES);
    }
  }, []);

  // Login Admin
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'revalixx_admin') {
      setIsAdmin(true);
      localStorage.setItem('revalixx_admin_active', 'true');
      setIsLoginModalOpen(false);
      setAdminPassword('');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  // Ajout d'une image
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) return;

    const newImage: GalleryImage = {
      id: `local-img-${Date.now()}`,
      url: newImageUrl,
      caption: newCaption || 'NO CAPTION',
      date: new Date().getFullYear().toString()
    };

    const currentCustomImages = images.filter(img => String(img.id).startsWith('local-'));
    const updatedCustomImages = [newImage, ...currentCustomImages];
    
    // Sauvegarder dans localStorage
    localStorage.setItem('revalixx_custom_images', JSON.stringify(updatedCustomImages));
    
    // Mettre à jour l'état local
    setImages([newImage, ...images]);
    
    // Reset form
    setIsUploadOpen(false);
    setNewImageUrl('');
    setNewCaption('');
  };

  // Suppression d'une image
  const handleDeleteImage = (id: string, e: React.MouseEvent) => {
    // Empêcher la propagation pour éviter les conflits de clics
    e.preventDefault();
    e.stopPropagation();

    console.log("Deleting image:", id);

    // NOTE: Suppression de la fenêtre de confirmation 'window.confirm' 
    // car elle peut être bloquée dans certains environnements de preview.
    
    // 1. Mise à jour immédiate de l'interface (State)
    setImages(prevImages => prevImages.filter(img => String(img.id) !== String(id)));

    // 2. Persistance de la suppression (LocalStorage)
    try {
        const idStr = String(id);
        if (idStr.startsWith('local-')) {
            // C'est une image custom -> on la retire du tableau custom
            const savedCustom = localStorage.getItem('revalixx_custom_images');
            if (savedCustom) {
                const parsed: GalleryImage[] = JSON.parse(savedCustom);
                const updated = parsed.filter(img => String(img.id) !== idStr);
                localStorage.setItem('revalixx_custom_images', JSON.stringify(updated));
            }
        } else {
            // C'est une image par défaut -> on ajoute son ID à la blacklist
            const deletedDefaultsStr = localStorage.getItem('revalixx_deleted_defaults');
            let deletedIds: string[] = deletedDefaultsStr ? JSON.parse(deletedDefaultsStr) : [];
            
            if (!deletedIds.includes(idStr)) {
                deletedIds.push(idStr);
                localStorage.setItem('revalixx_deleted_defaults', JSON.stringify(deletedIds));
            }
        }
    } catch (err) {
        console.error("Storage error:", err);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center relative">
          <h1 className="text-6xl md:text-9xl font-heading font-black tracking-tighter italic opacity-10 absolute left-1/2 -translate-x-1/2 -translate-y-12 select-none pointer-events-none uppercase whitespace-nowrap">VISUAL ARCHIVE</h1>
          <h2 className="text-4xl md:text-6xl font-heading font-bold relative z-10 uppercase">THE VOID</h2>
          <div className="h-1 w-20 bg-red-600 mx-auto mt-6"></div>
          
          <div className="mt-8">
            {isAdmin ? (
               <button 
                 onClick={() => setIsUploadOpen(true)}
                 className="px-6 py-3 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors font-heading text-[10px] tracking-widest uppercase"
               >
                 + UPLOAD TO ARCHIVE
               </button>
            ) : (
               <button 
                 onClick={() => setIsLoginModalOpen(true)}
                 className="text-[9px] text-gray-600 font-heading tracking-widest hover:text-red-600 transition-colors uppercase"
               >
                 SECURE LOGIN
               </button>
            )}
          </div>
        </header>

        {/* Modal Login */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsLoginModalOpen(false)}></div>
            <div className="relative w-full max-w-sm glass-card p-8 border-t-2 border-t-red-600">
              <h2 className="text-xl font-heading mb-6 italic text-center">ACCESS PROTOCOL</h2>
              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <input 
                  type="password" 
                  autoFocus
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className={`w-full bg-black border ${loginError ? 'border-red-600' : 'border-white/10'} px-4 py-3 text-white text-center focus:border-red-600 outline-none transition-colors`}
                  placeholder="PASSKEY"
                />
                <button type="submit" className="w-full py-3 bg-red-600 text-white font-heading text-[10px] tracking-widest uppercase">AUTHENTICATE</button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Upload */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsUploadOpen(false)}></div>
            <div className="relative w-full max-w-lg glass-card p-8 border border-white/10">
              <h2 className="text-2xl font-heading mb-8 uppercase">ADD VISUAL</h2>
              <form onSubmit={handleAddImage} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-heading tracking-widest text-gray-500 mb-2">IMAGE URL</label>
                  <input 
                    type="text" 
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-red-600 outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-heading tracking-widest text-gray-500 mb-2">CAPTION</label>
                  <input 
                    type="text" 
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-red-600 outline-none"
                    placeholder="EVENT NAME / LOCATION"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsUploadOpen(false)} className="flex-1 py-3 border border-white/10 text-gray-400 font-heading text-[10px] tracking-widest hover:text-white">CANCEL</button>
                  <button type="submit" className="flex-1 py-3 bg-red-600 text-white font-heading text-[10px] tracking-widest hover:bg-red-700">UPLOAD</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {images.map((img) => (
            <div key={img.id} className="relative break-inside-avoid mb-8">
              <div className="relative border border-white/5 bg-[#050505] group">
                <div className="relative overflow-hidden">
                    <img 
                      src={img.url} 
                      alt={img.caption}
                      className="w-full h-auto object-cover grayscale brightness-75 contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
                    />
                    
                    {/* Overlay Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10 pointer-events-none">
                      <span className="text-red-600 font-heading text-[9px] tracking-widest uppercase mb-1">{img.date}</span>
                      <h3 className="text-xl font-heading font-bold text-white uppercase italic">{img.caption}</h3>
                    </div>
                </div>

                {/* Admin Control Bar - Séparé de l'image */}
                {isAdmin && (
                  <div className="border-t border-white/10 bg-black p-3 relative z-50">
                    <button 
                        type="button"
                        onClick={(e) => handleDeleteImage(img.id, e)}
                        className="w-full py-2 bg-red-900/20 border border-red-600/50 text-red-500 hover:bg-red-600 hover:text-white transition-all font-heading text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        <span>DELETE IMAGE</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {images.length === 0 && (
            <div className="text-center py-20 border border-white/10 border-dashed">
                <p className="text-gray-500 font-heading text-sm tracking-widest">ARCHIVE EMPTY</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
