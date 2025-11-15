import { Injectable } from "@nestjs/common";

import { SqlService } from "../sql.service";
import { CreateMovieDto } from "./dto/createMovie.dto";
import type { UpdateMovieDto } from "./dto/updateMovie.dto";
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
      INSERT INTO movies (title, year, runtime, genres)
      VALUES (${createMovieDto.title}, ${createMovieDto.year}, ${createMovieDto.runtime}, ${this.sqlService.sql.array(createMovieDto.genres)})
    `;
  }

  async getMovieById(id: number): Promise<Movie> {
    const [movie] = await this.sqlService.sql`
      SELECT * FROM movies WHERE id = ${id}
    `;
    return movie;
  }

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    await this.sqlService.sql`
    		UPDATE movies
        SET title = ${updateMovieDto.title}, year = ${updateMovieDto.year}, runtime = ${updateMovieDto.runtime}, genres = ${this.sqlService.sql.array(updateMovieDto.genres)}
        WHERE id = ${id}
        RETURNING version
    `;
  }

  async deleteMovie(id: number) {
    await this.sqlService.sql`
      DELETE FROM movies WHERE id = ${id}
    `;
  }
}
