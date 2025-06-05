export interface SearchFilters {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  category?: string;
  priceRange?: [number, number];
  propertyType?: string;
}

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

export const CATEGORIES = [
  { id: 'amazing-views', label: 'Amazing views', icon: 'fas fa-home' },
  { id: 'beachfront', label: 'Beachfront', icon: 'fas fa-umbrella-beach' },
  { id: 'cabins', label: 'Cabins', icon: 'fas fa-mountain' },
  { id: 'trending', label: 'Trending', icon: 'fas fa-city' },
  { id: 'amazing-pools', label: 'Amazing pools', icon: 'fas fa-swimming-pool' },
  { id: 'treehouses', label: 'Treehouses', icon: 'fas fa-tree' },
  { id: 'design', label: 'Design', icon: 'fas fa-building' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];
