import { Module } from "@nestjs/common";

import { SqlService } from "../sql.service";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";

@Module({
  imports: [],
  controllers: [MoviesController],
  providers: [MoviesService, SqlService],
})
export class MovieModule {}
