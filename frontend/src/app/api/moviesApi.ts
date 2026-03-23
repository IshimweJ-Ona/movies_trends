import { Genre, Movie } from '../data/types';

const DEFAULT_POSTER =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500';

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL as string | undefined;

interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids: number[];
  vote_average: number;
  release_date: string;
  overview?: string;
}

interface TmdbMoviesResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

interface TmdbGenresResponse {
  genres: Genre[];
}

interface YouTubeVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface VideosResponse {
  results: YouTubeVideo[];
}

const ensureLeadingSlash = (value: string) => (value.startsWith('/') ? value : `/${value}`);


const buildUrl = (path: string, params?: Record<string, string | number | undefined>) => {
  const normalizedPath = ensureLeadingSlash(path);
  const apiPath = API_BASE ? normalizedPath : `/api${normalizedPath}`;
  
  let url = `${API_BASE ?? ''}${apiPath}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([keyframes, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(keyframes, String(value));
      }
    });
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
  }

  return url;
};

const request = async <T>(path: string, params?: Record<string, string | number | undefined>, signal?: AbortSignal): Promise<T> => {
  const url = buildUrl(path, params);
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const fetchGenres = async (signal?: AbortSignal): Promise<Genre[]> => {
  const data = await request<TmdbGenresResponse>('/genres', undefined, signal);
  return data.genres || [];
};

export const fetchMovies = async (
  params: {
    q?: string;
    genre?: string;
    sort?: 'popular' | 'newest' | 'rating';
    page?: number;
  },
  genreMap: Record<number, string>,
  signal?: AbortSignal
): Promise<{
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}> => {
  const data = await request<TmdbMoviesResponse>('/movies', params, signal);

  const movies: Movie[] = data.results.map((movie) => {
    const year = movie.release_date ? Number(movie.release_date.slice(0, 4)) : 0;
    const genres = movie.genre_ids
      .map((id) => genreMap[id])
      .filter((name): name is string => Boolean(name));

    return {
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : DEFAULT_POSTER,
      genres,
      rating: movie.vote_average ?? 0,
      year,
      overview: movie.overview,
    };
  });

  return {
    movies,
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
};

export const fetchMovieVideos = async (
  movieId: number,
  signal?: AbortSignal
): Promise<YouTubeVideo | null> => {
  try {
    const data = await request<VideosResponse>(`/movies/${movieId}/videos`, undefined, signal);
    const youtubeTrailer = (data.results || []).find(
      (v) => v.site === 'YouTube'
    );
    if (!youtubeTrailer && (data as any).message) {
      throw new Error((data as any).message);
    }
    return youtubeTrailer || null;
  } catch (error: any) {
    console.error('Failed to fetch video:', error);
    throw new Error(error?.message || 'Failed to fetch video');
  }
};
