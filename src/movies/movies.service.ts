import { Injectable, NotFoundException } from "@nestjs/common";

import { SqlService } from "../sql/sql.service";
import { CreateMovieDto } from "./dto/createMovie.dto";
import { UpdateMovieDto } from "./dto/updateMovie.dto";
import type { Movie } from "./interfaces/Movie";

@Injectable()
export class MoviesService {
  constructor(private readonly sqlService: SqlService) {}

  async getMovies(): Promise<Movie[]> {
    const movies = await this.sqlService.sql`
      SELECT * FROM movies
    `;
    return movies;
  }

  async createMovie(createMovieDto: CreateMovieDto) {
    await this.sqlService.sql`
      INSERT INTO movies ${this.sqlService.sql({
        title: createMovieDto.title,
        year: createMovieDto.year,
        runtime: createMovieDto.runtime,
        genres: this.sqlService.sql.array(createMovieDto.genres, "TEXT"),
      })}
    `;
  }

  async getMovieById(id: number): Promise<Movie> {
    const [movie] = await this.sqlService.sql`
      SELECT * FROM movies WHERE id = ${id}
    `;
    if (!movie) {
      throw new NotFoundException("Movie not found");
    }
    return movie;
  }

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.getMovieById(id);
    if (updateMovieDto.title) {
      movie.title = updateMovieDto.title;
    }
    if (updateMovieDto.year) {
      movie.year = updateMovieDto.year;
    }
    if (updateMovieDto.runtime) {
      movie.runtime = updateMovieDto.runtime;
    }
    if (updateMovieDto.genres) {
      movie.genres = updateMovieDto.genres;
    }
    await this.sqlService.sql`
    		UPDATE movies
        SET title = ${movie.title}, year = ${movie.year}, runtime = ${movie.runtime}, genres = ${this.sqlService.sql.array(movie.genres, "TEXT")}
        WHERE id = ${id}
        RETURNING version
    `;
  }

  async deleteMovie(id: number) {
    await this.getMovieById(id);
    await this.sqlService.sql`
      DELETE FROM movies WHERE id = ${id}
    `;
  }
}
