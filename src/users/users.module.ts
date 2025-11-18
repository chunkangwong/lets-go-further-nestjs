import { Module } from "@nestjs/common";

import { PermissionsModule } from "../permissions/permissions.module";
import { SqlModule } from "../sql/sql.module";
import { TokensModule } from "../tokens/tokens.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [PermissionsModule, TokensModule, SqlModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
