interface Character {
  created: string;
  episode: Array<string>;
  gender: string;
  id: number;
  image: string;
  location: { name: string; url: string };
  name: string;
  origin: { name: string; url: string };
  species: string;
  status: string;
  type: string;
  url: string;
}

export interface ApiData {
  info: {
    count: number;
    next: string;
    pages: number;
    prev: string | null;
  };
  results: Character[];
}
