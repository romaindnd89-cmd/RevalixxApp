
import React, { useState, useEffect } from 'react';
import { VIDEOS as STATIC_VIDEOS } from '../constants';
import { VideoContent } from '../types';

const VideoHub: React.FC = () => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [filter, setFilter] = useState<'All' | 'Live' | 'Music Video' | 'Studio'>('All');
  const [isUploading, setIsUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [liveActive, setLiveActive] = useState(false);
  const [liveText, setLiveText] = useState('THE REVALIXX TAKEOVER');
  const [liveUrl, setLiveUrl] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Live' | 'Music Video' | 'Studio'>('Live');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    const adminStatus = localStorage.getItem('revalixx_admin_active');
    if (adminStatus === 'true') setIsAdmin(true);

    try {
      const savedLive = localStorage.getItem('revalixx_live_config');
      if (savedLive) {
        const config = JSON.parse(savedLive);
        setLiveActive(!!config.active);
        setLiveText(config.text || 'THE REVALIXX TAKEOVER');
        setLiveUrl(config.url || '');
      }

      const savedVideos = localStorage.getItem('revalixx_custom_videos');
      if (savedVideos) {
        const parsed = JSON.parse(savedVideos);
        if (Array.isArray(parsed)) {
          setVideos([...parsed, ...STATIC_VIDEOS]);
        } else {
          setVideos(STATIC_VIDEOS);
        }
      } else {
        setVideos(STATIC_VIDEOS);
      }
    } catch (e) {
      console.error("Error loading stored data", e);
      setVideos(STATIC_VIDEOS);
    }
  }, []);

  const getYouTubeThumbnail = (url: string) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7] && match[7].length === 11) ? match[7] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const saveLiveConfig = (active: boolean, text: string, url: string) => {
    const config = { active, text, url };
    localStorage.setItem('revalixx_live_config', JSON.stringify(config));
    setLiveActive(active);
    setLiveText(text);
    setLiveUrl(url);
  };

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

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const autoThumb = getYouTubeThumbnail(videoUrl) || getYouTubeThumbnail(thumbnailUrl);
    const finalThumb = autoThumb || thumbnailUrl || 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800';

    const newVideo: VideoContent = {
      id: `local-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      duration: 'NEW',
      thumbnail: finalThumb,
      videoUrl: videoUrl
    };

    const currentLocal = videos.filter(v => v.id.toString().startsWith('local-'));
    const updatedLocal = [newVideo, ...currentLocal];
    localStorage.setItem('revalixx_custom_videos', JSON.stringify(updatedLocal));
    
    setVideos([newVideo, ...videos]);
    setIsUploading(false);
    setNewTitle('');
    setVideoUrl('');
    setThumbnailUrl('');
  };

  const handleDeleteVideo = (id: string | number) => {
    if (!window.confirm("Delete permanently?")) return;
    const updatedVideos = videos.filter(v => v.id !== id);
    setVideos(updatedVideos);
    const onlyLocal = updatedVideos.filter(v => v.id.toString().startsWith('local-'));
    localStorage.setItem('revalixx_custom_videos', JSON.stringify(onlyLocal));
  };

  const filteredVideos = filter === 'All' ? videos : videos.filter(v => v.category === filter);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-red-600 font-heading text-[10px] tracking-[0.5em] mb-4 block">REVALIXX MEDIA HUB</span>
            <h1 className="text-5xl md:text-8xl font-heading font-black tracking-tighter italic uppercase">VIDEO MENU</h1>
            <div className="h-1 w-24 bg-red-600 mt-6"></div>
          </div>
          
          {isAdmin ? (
            <button 
              onClick={() => setIsUploading(true)}
              className="px-10 py-5 bg-red-600 text-white font-heading text-[10px] tracking-widest hover:bg-white hover:text-black transition-all"
            >
              + GESTION ADMIN
            </button>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="opacity-20 hover:opacity-100 transition-opacity text-[8px] font-heading tracking-widest border border-white/10 px-4 py-2 hover:border-white"
            >
              ADMIN ACCESS
            </button>
          )}
        </header>

        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsLoginModalOpen(false)}></div>
            <div className="relative w-full max-w-sm glass-card p-8 border-t-2 border-t-red-600">
              <h2 className="text-xl font-heading mb-6 italic text-center">RESTRICTED AREA</h2>
              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <input 
                  type="password" 
                  autoFocus
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className={`w-full bg-black border ${loginError ? 'border-red-600' : 'border-white/10'} px-4 py-3 text-white text-center focus:border-red-600 outline-none transition-colors`}
                  placeholder="••••••••"
                />
                <button type="submit" className="w-full py-3 bg-red-600 text-white font-heading text-[10px] tracking-widest uppercase">Authenticate</button>
              </form>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 overflow-y-auto">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsUploading(false)}></div>
            <div className="relative w-full max-w-3xl glass-card p-10 border-t-4 border-t-red-600 my-8">
              <div className="grid md:grid-cols-2 gap-12">
                <section>
                  <h2 className="text-xl font-heading mb-6 italic text-red-600 uppercase">LIVE SETTINGS</h2>
                  <div className="space-y-4">
                    <button 
                      onClick={() => saveLiveConfig(!liveActive, liveText, liveUrl)}
                      className={`w-full py-2 text-[10px] font-heading tracking-widest border border-white/10 ${liveActive ? 'bg-red-600 text-white' : 'text-gray-500'}`}
                    >
                      {liveActive ? 'LIVE: ON' : 'LIVE: OFF'}
                    </button>
                    <input 
                      type="text" 
                      value={liveText} 
                      onChange={(e) => saveLiveConfig(liveActive, e.target.value, liveUrl)}
                      placeholder="Texte du Live..."
                      className="w-full bg-black border border-white/10 px-4 py-2 text-xs text-white outline-none"
                    />
                    <input 
                      type="text" 
                      value={liveUrl} 
                      onChange={(e) => saveLiveConfig(liveActive, liveText, e.target.value)}
                      placeholder="Lien (Twitch/YouTube)..."
                      className="w-full bg-black border border-white/10 px-4 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </section>
                <section>
                  <h2 className="text-xl font-heading mb-6 italic uppercase">ADD VIDEO</h2>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Titre" className="w-full bg-black border border-white/10 px-4 py-2 text-xs text-white outline-none" />
                    <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Lien Vidéo" className="w-full bg-black border border-white/10 px-4 py-2 text-xs text-white outline-none" />
                    <input type="text" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="Miniature URL" className="w-full bg-black border border-white/10 px-4 py-2 text-xs text-white outline-none" />
                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)} className="w-full bg-black border border-white/10 px-4 py-2 text-xs text-white outline-none">
                      <option value="Live">LIVE SET</option>
                      <option value="Music Video">MUSIC VIDEO</option>
                      <option value="Studio">STUDIO SESSION</option>
                    </select>
                    <button type="submit" className="w-full py-3 bg-red-600 text-white font-heading text-[10px] tracking-widest uppercase">Upload</button>
                  </form>
                </section>
              </div>
              <button onClick={() => setIsUploading(false)} className="mt-8 text-[10px] font-heading text-gray-500 hover:text-white transition-colors uppercase tracking-widest">Fermer</button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-16">
          {['All', 'Live', 'Music Video', 'Studio'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-8 py-3 text-[9px] font-heading tracking-[0.3em] border transition-all ${
                filter === cat ? 'bg-red-600 text-white border-red-600' : 'border-white/10 text-gray-500 hover:border-white/40'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredVideos.map((video, idx) => (
            <div 
              key={video.id} 
              className="group relative overflow-hidden bg-[#0a0a0a] border border-white/5 cursor-pointer"
              onClick={() => video.videoUrl && window.open(video.videoUrl, '_blank')}
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white text-[8px] font-heading px-2 py-1 tracking-widest uppercase">{video.category}</span>
                </div>
                {isAdmin && video.id.toString().startsWith('local-') && (
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteVideo(video.id); }} className="absolute top-4 right-4 z-10 w-8 h-8 bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div className="max-w-[70%]">
                    <span className="text-[10px] text-gray-400 font-heading block mb-1 uppercase tracking-widest">
                      {video.id.toString().startsWith('local-') ? 'ADMIN RELEASE' : `OFFICIAL 0${idx + 1}`} — {video.duration}
                    </span>
                    <h3 className="text-xl font-heading font-bold leading-tight group-hover:text-red-600 transition-colors uppercase italic">{video.title}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoHub;
