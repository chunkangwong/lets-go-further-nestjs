import { Module } from "@nestjs/common";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { SqlService } from "src/sql.service";

@Module({
  imports: [],
  controllers: [MoviesController],
  providers: [MoviesService, SqlService],
})
export class MovieModule {}
