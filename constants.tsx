
import { Artist, TourDate, VideoContent, GalleryImage } from './types';

export const ARTISTS: Artist[] = [
  {
    name: 'ALIXX',
    instagram: 'alix',
    role: 'RAWSTYLE / HARDSTYLE',
    description: 'Forging a path through the darkest corners of rawstyle, Alixx combines atmospheric melodies with shattering kicks. His sound is defined by industrial influences and high-tension energy.',
    // Image sombre, silhouette DJ avec lumières
    imageUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'DJ REVAXX',
    instagram: 'djrevaxx_music',
    role: 'UPTEMPO / HARDCORE',
    description: 'The relentless engine of Revalixx. Revaxx is specialized in extreme BPM ranges, delivering high-velocity uptempo sets that leave crowds breathless. Pure aggression, no compromise.',
    // Image agressive, scène rouge
    imageUrl: 'https://images.unsplash.com/photo-1571266028243-371695039980?auto=format&fit=crop&q=80&w=800'
  }
];

export const TOUR_DATES: TourDate[] = [
  { id: '1', venue: 'DARKNESS RITUAL', city: 'Lyon', country: 'FR', date: '2024-11-20', status: 'Tickets' },
  { id: '2', venue: 'WAREHOUSE EXPERIENCE', city: 'Paris', country: 'FR', date: '2024-12-05', status: 'Sold Out' },
  { id: '3', venue: 'HELLBOUND FESTIVAL', city: 'Montpellier', country: 'FR', date: '2024-12-31', status: 'Soon' },
  { id: '4', venue: 'INDUSTRIAL GARDEN', city: 'Toulouse', country: 'FR', date: '2025-01-14', status: 'Tickets' },
  { id: '5', venue: 'REVALIXX INVADES BELGIUM', city: 'Antwerp', country: 'BE', date: '2025-02-02', status: 'Tickets' }
];

export const VIDEOS: VideoContent[] = [
  { id: '1', title: 'ALIXX - RITUAL OF CHAOS (Official Video)', thumbnail: 'https://images.unsplash.com/photo-1514525253361-b83f859b73c0?auto=format&fit=crop&q=80&w=800', duration: '03:45', category: 'Music Video' },
  { id: '2', title: 'DJ REVAXX - 240 BPM MADNESS (Live at Zenith)', thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800', duration: '45:20', category: 'Live' },
  { id: '3', title: 'REVALIXX ANTHEM 2024 (ft. Mc Darkness)', thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800', duration: '04:12', category: 'Music Video' },
  { id: '4', title: 'Inside the Revalixx Sound: Bass Tutorial', thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800', duration: '12:05', category: 'Studio' }
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2079&auto=format&fit=crop', caption: 'CROWD CONTROL', date: '2024' },
  { id: '2', url: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?q=80&w=2676&auto=format&fit=crop', caption: 'LASER ATTACK', date: '2024' },
  { id: '3', url: 'https://images.unsplash.com/photo-1576525865260-9f0e7f702645?q=80&w=2670&auto=format&fit=crop', caption: 'THE BOOTH', date: '2023' },
  { id: '4', url: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2670&auto=format&fit=crop', caption: 'BACKSTAGE', date: '2023' },
  { id: '5', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670&auto=format&fit=crop', caption: 'MAIN STAGE', date: '2024' },
  { id: '6', url: 'https://images.unsplash.com/photo-1557787163-1635e2efb160?q=80&w=2683&auto=format&fit=crop', caption: 'HARD TECHNO SOUL', date: '2024' }
];