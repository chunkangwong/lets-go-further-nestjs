export interface Movie {
  id: number;
  created_at: Date;
  title: string;
  year: number;
  runtime: number;
  genres: string[];
  version: number;
}
