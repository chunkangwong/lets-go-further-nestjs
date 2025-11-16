import { Test, TestingModule } from "@nestjs/testing";

import { SqlService } from "../sql/sql.service";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";

describe("MoviesController", () => {
  let moviesModule: TestingModule;

  beforeAll(async () => {
    moviesModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService, SqlService],
    }).compile();
  });

  describe("getMovies", () => {
    it("should return an empty array", () => {
      const moviesController = moviesModule.get(MoviesController);
      expect(moviesController.getMovies()).resolves.toEqual([]);
    });
  });

  describe("getMovieById", () => {
    it("should return a movie", () => {
      const moviesController = moviesModule.get(MoviesController);
      expect(moviesController.getMovieById({ id: "2" })).resolves.toEqual(
        expect.objectContaining({
          title: "Moana",
          runtime: 120,
          version: 1,
          year: 2020,
        })
      );
    });
  });
});
