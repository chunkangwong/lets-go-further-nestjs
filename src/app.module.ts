import { Module } from "@nestjs/common";

import { HealthCheckModule } from "./healthCheck/healthCheck.module";
import { MovieModule } from "./movies/movie.module";
import { TokensModule } from "./tokens/tokens.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [MovieModule, HealthCheckModule, UsersModule, TokensModule],
})
export class AppModule {}
