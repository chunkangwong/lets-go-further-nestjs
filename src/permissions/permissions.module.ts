import { Module } from "@nestjs/common";

import { SqlService } from "../sql/sql.service";
import { PermissionsService } from "./permissions.service";

@Module({
  imports: [],
  controllers: [],
  providers: [PermissionsService, SqlService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
