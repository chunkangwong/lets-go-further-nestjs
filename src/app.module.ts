import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthCheckModule } from "./healthCheck/healthCheck.module";
import { MovieModule } from "./movies/movie.module";

@Module({
  imports: [MovieModule, HealthCheckModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
