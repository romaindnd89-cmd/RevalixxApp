
import React, { useState, useEffect } from 'react';
import { GALLERY_IMAGES } from '../constants';
import { GalleryImage } from '../types';
import { addImageToDb, deleteImageFromDb, subscribeToGallery } from '../services/firebase';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(true); // Toujours true maintenant
  
  // États pour le modal de login
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // États pour l'upload
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'link' | 'file'>('file');
  
  // Formulaire Upload
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  
  // Gestion ImgBB
  const [imgbbKey, setImgbbKey] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // 1. Initialisation au chargement
  useEffect(() => {
    // Vérifier Admin
    const adminStatus = localStorage.getItem('revalixx_admin_active');
    if (adminStatus === 'true') setIsAdmin(true);

    // Charger clé ImgBB
    const savedImgKey = localStorage.getItem('revalixx_imgbb_key');
    if (savedImgKey) setImgbbKey(savedImgKey);

    // S'abonner directement à Firebase
    const unsubscribe = subscribeToGallery((dbImages) => {
        // Fusionner DB images avec Static images (filtrées)
        const deletedDefaultsStr = localStorage.getItem('revalixx_deleted_defaults');
        let deletedIds: string[] = deletedDefaultsStr ? JSON.parse(deletedDefaultsStr) : [];
        const visibleDefaults = GALLERY_IMAGES.filter(img => !deletedIds.includes(String(img.id)));
        
        // Priorité aux images DB
        setImages([...dbImages, ...visibleDefaults]);
    });

    return () => unsubscribe();
  }, []);

  // --- ACTIONS ADMIN ---

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

  const handleSaveKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setImgbbKey(key);
    localStorage.setItem('revalixx_imgbb_key', key);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError('');
    }
  };

  const uploadToImgBB = async (): Promise<string | null> => {
    if (!selectedFile || !imgbbKey) {
        setUploadError("Missing File or API Key");
        return null;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            return data.data.url;
        } else {
            throw new Error(data.error?.message || "Upload failed");
        }
    } catch (error: any) {
        setUploadError("Upload Error: " + error.message);
        return null;
    }
  };

  // AJOUT D'UNE IMAGE
  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalUrl = newImageUrl;

    if (uploadMode === 'file') {
        if (!selectedFile) return;
        setIsUploading(true);
        const uploadedUrl = await uploadToImgBB();
        setIsUploading(false);
        if (!uploadedUrl) return;
        finalUrl = uploadedUrl;
    }

    if (!finalUrl) return;
    const finalCaption = newCaption || 'NO CAPTION';

    // Envoyer au Cloud (Firebase)
    try {
      await addImageToDb(finalUrl, finalCaption);
      setIsUploadOpen(false);
      setNewImageUrl('');
      setNewCaption('');
      setSelectedFile(null);
    } catch (err: any) {
      console.error("DB Error", err);
      // Fallback local storage si erreur réseau
      setUploadError("Network Error. Saving locally instead.");
      
      const newImage: GalleryImage = {
        id: `local-img-${Date.now()}`,
        url: finalUrl,
        caption: finalCaption,
        date: new Date().getFullYear().toString()
      };
      setImages([newImage, ...images]);
      setIsUploadOpen(false);
    }
  };

  // SUPPRESSION
  const handleDeleteImage = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Si c'est une image de la DB (id n'est pas 'local-' et pas un chiffre simple)
    if (!String(id).startsWith('local-') && isNaN(Number(id))) {
      try {
        await deleteImageFromDb(id);
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
    // 2. Gestion LocalStorage (Fallback & Static Blacklist)
    else {
      setImages(prevImages => prevImages.filter(img => String(img.id) !== String(id)));
      
      const idStr = String(id);
      if (idStr.startsWith('local-')) {
          // Suppression locale
      } else {
          // Masquer image statique par défaut
          const deletedDefaultsStr = localStorage.getItem('revalixx_deleted_defaults');
          let deletedIds: string[] = deletedDefaultsStr ? JSON.parse(deletedDefaultsStr) : [];
          if (!deletedIds.includes(idStr)) {
              deletedIds.push(idStr);
              localStorage.setItem('revalixx_deleted_defaults', JSON.stringify(deletedIds));
          }
      }
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center relative">
          <h1 className="text-6xl md:text-9xl font-heading font-black tracking-tighter italic opacity-10 absolute left-1/2 -translate-x-1/2 -translate-y-12 select-none pointer-events-none uppercase whitespace-nowrap">VISUAL ARCHIVE</h1>
          <h2 className="text-4xl md:text-6xl font-heading font-bold relative z-10 uppercase">THE VOID</h2>
          <div className="h-1 w-20 bg-red-600 mx-auto mt-6"></div>
          
          <div className="mt-8 flex justify-center gap-4">
            {isAdmin ? (
                 <button 
                   onClick={() => setIsUploadOpen(true)}
                   className="px-6 py-3 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors font-heading text-[10px] tracking-widest uppercase flex items-center gap-2"
                 >
                   <span>+ UPLOAD TO ARCHIVE</span>
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-2" title="Cloud Active"></span>
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
            <div className="relative w-full max-w-lg glass-card p-8 border border-white/10 bg-black">
              <h2 className="text-2xl font-heading mb-6 uppercase">ADD VISUAL</h2>
              
              {/* Tabs */}
              <div className="flex mb-6 border-b border-white/10">
                <button 
                    onClick={() => setUploadMode('file')}
                    className={`flex-1 py-3 text-[10px] font-heading tracking-widest transition-colors ${uploadMode === 'file' ? 'text-red-600 border-b border-red-600' : 'text-gray-500 hover:text-white'}`}
                >
                    FILE UPLOAD
                </button>
                <button 
                    onClick={() => setUploadMode('link')}
                    className={`flex-1 py-3 text-[10px] font-heading tracking-widest transition-colors ${uploadMode === 'link' ? 'text-red-600 border-b border-red-600' : 'text-gray-500 hover:text-white'}`}
                >
                    DIRECT LINK
                </button>
              </div>

              <form onSubmit={handleAddImage} className="space-y-6">
                
                {/* Mode FILE UPLOAD */}
                {uploadMode === 'file' && (
                    <div className="space-y-4">
                        <div className="bg-red-900/10 border border-red-900/30 p-4 rounded">
                            <label className="block text-[9px] font-heading tracking-widest text-red-400 mb-2">IMGBB API KEY (REQUIRED)</label>
                            <input 
                                type="text" 
                                value={imgbbKey}
                                onChange={handleSaveKey}
                                className="w-full bg-black border border-white/10 px-3 py-2 text-white text-xs focus:border-red-600 outline-none"
                                placeholder="Paste your API Key here..."
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-heading tracking-widest text-gray-500 mb-2">SELECT IMAGE</label>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-heading file:tracking-widest file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                            />
                        </div>
                    </div>
                )}

                {/* Mode DIRECT LINK */}
                {uploadMode === 'link' && (
                    <div>
                        <label className="block text-[10px] font-heading tracking-widest text-gray-500 mb-2">IMAGE URL</label>
                        <input 
                            type="text" 
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-red-600 outline-none"
                            placeholder="https://..."
                        />
                    </div>
                )}

                <div>
                  <label className="block text-[10px] font-heading tracking-widest text-gray-500 mb-2">CAPTION</label>
                  <input 
                    type="text" 
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-red-600 outline-none uppercase"
                    placeholder="EVENT NAME / LOCATION"
                  />
                </div>

                {uploadError && (
                    <div className="text-red-500 text-xs font-heading">{uploadError}</div>
                )}

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsUploadOpen(false)} className="flex-1 py-3 border border-white/10 text-gray-400 font-heading text-[10px] tracking-widest hover:text-white">CANCEL</button>
                  <button 
                    type="submit" 
                    disabled={isUploading || (uploadMode === 'file' && !selectedFile)}
                    className={`flex-1 py-3 font-heading text-[10px] tracking-widest transition-all ${isUploading ? 'bg-gray-800 text-gray-500 cursor-wait' : 'bg-red-600 text-white hover:bg-red-700'}`}
                  >
                    {isUploading ? 'UPLOADING...' : 'CONFIRM & SYNC'}
                  </button>
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
                        <span>DELETE</span>
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
