import { emptyObject, hookAbortSignalPromise, hookGetAbortSignal } from "wy-helper";

async function getJSON<T>(url: string, args: Record<string, string | number> = emptyObject): Promise<T> {
  const toUrl = new URL(url)
  for (const key in args) {
    const value = args[key] as string
    if (typeof value != 'undefined') {
      toUrl.searchParams.append(key, value)
    }
  }
  const signal = hookGetAbortSignal()
  const res = await fetch(toUrl.toString(), {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGEzMjc2YWE2ZGQxZmE1ZmE2YzFhZDQyOGI0Zjg2OSIsIm5iZiI6MTY0NzY5NDQ4Ni43NTAwMDAyLCJzdWIiOiI2MjM1ZDI5NjQ2YWVkNDAwN2IxOTUzOGUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.jkFQTrtAZYCOYkFNpbx47C_r3AxDPcILDVcX_7V6d6I'
    },
    signal
  })
  return res.json()
}
type Genre = {
  id: number;
  name: string;
};
type ProductionCompany = {
  id: number;
  logoPath: string;
  name: string;
  originCountry: string;
};
type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};
type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};
export type Movie = {
  adult: boolean;
  backdrop_path: string;
  belongsToCollection: string;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdbId: string;
  original_language: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  poster_path: string;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};
export function discoverMovie(args: {
  page?: number
  sort_by?: string
}) {
  return getJSON<{
    page: number
    total_pages: number
    total_results: number
    results: Movie[]
  }>(`https://api.themoviedb.org/3/discover/movie`, args)
}


const configation = {
  "change_keys": [
    "adult",
    "air_date",
    "also_known_as",
    "alternative_titles",
    "biography",
    "birthday",
    "budget",
    "cast",
    "certifications",
    "character_names",
    "created_by",
    "crew",
    "deathday",
    "episode",
    "episode_number",
    "episode_run_time",
    "freebase_id",
    "freebase_mid",
    "general",
    "genres",
    "guest_stars",
    "homepage",
    "images",
    "imdb_id",
    "languages",
    "name",
    "network",
    "origin_country",
    "original_name",
    "original_title",
    "overview",
    "parts",
    "place_of_birth",
    "plot_keywords",
    "production_code",
    "production_companies",
    "production_countries",
    "releases",
    "revenue",
    "runtime",
    "season",
    "season_number",
    "season_regular",
    "spoken_languages",
    "status",
    "tagline",
    "title",
    "translations",
    "tvdb_id",
    "tvrage_id",
    "type",
    "video",
    "videos"
  ],
  "images": {
    "base_url": "http://image.tmdb.org/t/p/",
    "secure_base_url": "https://image.tmdb.org/t/p/",
    "backdrop_sizes": [
      "w300",
      "w780",
      "w1280",
      "original"
    ],
    "logo_sizes": [
      "w45",
      "w92",
      "w154",
      "w185",
      "w300",
      "w500",
      "original"
    ],
    "poster_sizes": [
      "w92",
      "w154",
      "w185",
      "w342",
      "w500",
      "w780",
      "original"
    ],
    "profile_sizes": [
      "w45",
      "w185",
      "h632",
      "original"
    ],
    "still_sizes": [
      "w92",
      "w185",
      "w300",
      "original"
    ]
  }
} as const

type Configation = typeof configation
export function buildPoster(url: string, size: Configation['images']['poster_sizes'][number] = 'w92') {
  if (!url) {
    return ''
  }
  return configation.images.secure_base_url + size + url
}
export function buildBackdrop(url: string, size: Configation['images']['backdrop_sizes'][number] = 'w780') {
  return configation.images.secure_base_url + size + url
}