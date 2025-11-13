import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import type { CreateMovieDto } from "./dto/createMovie.dto";
import type { UpdateMovieDto } from "./dto/updateMovie.dto";
import { MoviesService } from "./movies.service";

@Controller("/v1/movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getMovies() {
    return this.moviesService.getMovies();
  }

  @Post()
  createMovie(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Get(":id")
  getMovieById(@Param("id") id: number) {
    return this.moviesService.getMovieById(id);
  }

  @Patch(":id")
  updateMovie(@Param("id") id: number, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.updateMovie(id, updateMovieDto);
  }

  @Delete(":id")
  deleteMovie(@Param("id") id: number): string {
    return this.moviesService.deleteMovie(id);
  }
}
