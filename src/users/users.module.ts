import { Module } from "@nestjs/common";

import { PermissionsModule } from "../permissions/permissions.module";
import { SqlService } from "../sql/sql.service";
import { TokensModule } from "../tokens/tokens.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [PermissionsModule, TokensModule],
  controllers: [UsersController],
  providers: [UsersService, SqlService],
  exports: [UsersService],
})
export class UsersModule {}
