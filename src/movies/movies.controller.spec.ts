import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { SqlService } from "../sql/sql.service";
import { SqlModule } from "../sql/sql.module";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";

describe("MoviesController", () => {
  let moviesModule: TestingModule;
  let createdMovieId: number;

  beforeAll(async () => {
    moviesModule = await Test.createTestingModule({
      imports: [SqlModule],
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();
  });

  afterAll(async () => {
    await moviesModule.get(SqlService).sql`
      DELETE FROM movies WHERE title = 'Test Movie'
    `;
  });

  describe("getMovies", () => {
    it("should return 4 movies", () => {
      const moviesController = moviesModule.get(MoviesController);
      expect(moviesController.getMovies()).resolves.toHaveLength(4);
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
          genres: ["cartoon"],
          id: "2",
        })
      );
    });

    it("should throw a NotFoundException if the movie is not found", () => {
      const moviesController = moviesModule.get(MoviesController);
      expect(moviesController.getMovieById({ id: "999" })).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("createMovie", () => {
    it("should create a movie", async () => {
      const moviesController = moviesModule.get(MoviesController);
      const createdMovie = await moviesController.createMovie({
        title: "Test Movie",
        year: 2020,
        runtime: 120,
        genres: ["test"],
      });
      createdMovieId = createdMovie.id;

      const movie = await moviesController.getMovieById({
        id: createdMovieId.toString(),
      });
      expect(movie).toEqual(
        expect.objectContaining({
          title: "Test Movie",
          year: 2020,
          runtime: 120,
          genres: ["test"],
        })
      );
    });
  });

  describe("updateMovie", () => {
    it("should update a movie", async () => {
      const moviesController = moviesModule.get(MoviesController);
      await moviesController.updateMovie(
        { id: createdMovieId.toString() },
        {
          genres: ["test", "updated"],
        }
      );
      const movie = await moviesController.getMovieById({
        id: createdMovieId.toString(),
      });
      expect(movie).toEqual(
        expect.objectContaining({
          genres: ["test", "updated"],
        })
      );
    });

    it("should throw a NotFoundException if the movie is not found", () => {
      const moviesController = moviesModule.get(MoviesController);
      expect(
        moviesController.updateMovie(
          { id: "999" },
          {
            genres: ["test", "updated"],
          }
        )
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("deleteMovie", () => {
    it("should delete a movie", async () => {
      const moviesController = moviesModule.get(MoviesController);
      await moviesController.deleteMovie({ id: createdMovieId.toString() });
      expect(
        moviesController.getMovieById({
          id: createdMovieId.toString(),
        })
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw a NotFoundException if the movie is not found", () => {
      const moviesController = moviesModule.get(MoviesController);
      expect(moviesController.deleteMovie({ id: "999" })).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
