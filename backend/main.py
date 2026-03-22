import os
from typing import Any, Union, Optional, Dict, Tuple
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
import httpx
from cachetools import TTLCache
from fastapi.middleware.cors import CORSMiddleware
from httpx import AsyncClient, Timeout
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type
import time

# ------------------------------
# Load environment variables
# ------------------------------
load_dotenv()

TMDB_API_KEY: Optional[str] = os.getenv("TMDB_API_KEY")
if not TMDB_API_KEY:
    raise RuntimeError("TMDB_API_KEY not found in .env file")

TMDB_BASE_URL = "https://api.themoviedb.org/3"
IMG_BASE = "https://image.tmdb.org/t/p/w500"

# ------------------------------
# FastAPI app
# ------------------------------
app = FastAPI(
    title="MovieStream Backend",
    description="Backend API for MovieStream app with caching",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ------------------------------
# Caches (manual async-compatible)
# ------------------------------
genres_cache = TTLCache(maxsize=1, ttl=600)
movies_cache = TTLCache(maxsize=100, ttl=600)
videos_cache = TTLCache(maxsize=200, ttl=600)

# ------------------------------
# Helper function
# ------------------------------
def build_url(endpoint: str, params: Optional[Dict[Union[str, int], Union[str, int]]] = None) -> Tuple[str, Dict[Union[str, int], Union[str, int]]]:
    """Construct TMDB URL with API key"""
    if params is None:
        params = {}
    params["api_key"] = TMDB_API_KEY  # type: ignore
    url = f"{TMDB_BASE_URL}/{endpoint}"
    return url, params

# ------------------------------
# API Endpoints
# ------------------------------
@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "MovieStream API is running"}

@app.get("/genres")
async def get_genres():
    """Return list of movie genres with caching"""
    if "genres" in genres_cache:
        return genres_cache["genres"]

    url, params = build_url("genre/movie/list")
    async with AsyncClient() as client:
        data = await fetch_json(client, url, params)
    genres_cache["genres"] = data
    return data

@app.get("/movies")
async def get_movies(
    q: str = Query("", description="Search query"),
    genre: str = Query("all", description="Filter by genre ID"),
    sort: str = Query("popular", description="Sort by popular/newest/rating"),
    page: int = Query(1, ge=1, description="Page number")
):
    """Fetch movies from TMDB with caching"""

    cache_key = f"{q}|{genre}|{sort}|{page}"
    if cache_key in movies_cache:
        print(f"Cache hit for movies: {cache_key}")
        return movies_cache[cache_key]

    print(f"Cache miss for movies: {cache_key}")
    # Initialize params with type hint
    params: Dict[Union[str, int], Union[str, int]] = {"page": page}

    if q.strip():
        endpoint = "search/movie"
        params["query"] = q
    else:
        endpoint = "discover/movie"

    if genre != "all":
        params["with_genres"] = genre

    if sort == "newest":
        params["sort_by"] = "release_date.desc"
    elif sort == "rating":
        params["sort_by"] = "vote_average.desc"
    else:
        params["sort_by"] = "popularity.desc"

    url, final_params = build_url(endpoint, params)
    async with AsyncClient() as client:
        data = await fetch_json(client, url, final_params)
    movies_cache[cache_key] = data
    return data

@app.get("/movies/{movie_id}/videos")
async def get_movie_videos(movie_id: int):
    """Get only official Youtube trailers for a movie with caching"""
    cache_key = f"videos_{movie_id}"

    if cache_key in videos_cache:
        return videos_cache[cache_key]
    
    params: Dict[Union[str, int], Union[str, int]] = {}
    url, params = build_url(f"movie/{movie_id}/videos", params)

    async with AsyncClient() as client:
        data = await fetch_json(client, url, params)

        trailers = [
            v for v in data.get("results", [])
            if v.get("site", "").lower() == "youtube"
            and v.get("type") == "Trailer"
            and v.get("official", False) is True
            and "trailer" in v.get("name", "").lower()
        ]

        # Sort by quality 
        trailers = sorted(trailers, key=lambda x: x.get("size", 0), reverse=True)


    result = {"results": trailers[:1]}
    videos_cache[cache_key] = result
    return result

# ------------------------------
# Health check\
# ------------------------------
@app.get("/health")
async def health_check():
    return {"status": "ok"}

@retry(wait=wait_exponential(multiplier=1, min=1, max=10), stop=stop_after_attempt(3),
       retry=retry_if_exception_type(httpx.RequestError))
async def fetch_json(client: AsyncClient, url: str, params: Dict[Any, Any]):
    start = time.time()
    timeout = Timeout(10.0, connect=5.0)
    resp = await client.get(url, params=params, timeout=timeout)
    resp.raise_for_status()
    data = resp.json()
    elapsed = time.time() - start
    print(f"API call to {url} took {elapsed:.2f} seconds")
    return data
