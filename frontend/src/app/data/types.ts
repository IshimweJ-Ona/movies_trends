export interface Movie {
  id: number;
  title: string;
  poster: string;
  genres: string[];
  rating: number;
  year: number;
  overview?: string;
}

export interface Genre {
  id: number;
  name: string;
}
