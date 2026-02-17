
export interface Artist {
  name: string;
  instagram: string;
  role: string;
  description: string;
  imageUrl: string;
}

export interface TourDate {
  id: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  status: 'Soon' | 'Sold Out' | 'Tickets';
}

export interface VideoContent {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  category: 'Live' | 'Music Video' | 'Studio';
  videoUrl?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  date: string;
}
