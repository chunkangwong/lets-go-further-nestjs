import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateMovieDto } from "./dto/createMovie.dto";
import { MovieIdParam } from "./dto/movieIdParam.dto";
import { UpdateMovieDto } from "./dto/updateMovie.dto";
import { MoviesService } from "./movies.service";

@Controller({
  path: "movies",
  version: "1",
})
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
  getMovieById(@Param() params: MovieIdParam) {
    return this.moviesService.getMovieById(Number(params.id));
  }

  @Patch(":id")
  updateMovie(
    @Param("id") params: MovieIdParam,
    @Body() updateMovieDto: UpdateMovieDto
  ) {
    return this.moviesService.updateMovie(Number(params.id), updateMovieDto);
  }

  @Delete(":id")
  deleteMovie(@Param("id") params: MovieIdParam) {
    return this.moviesService.deleteMovie(Number(params.id));
  }
}
