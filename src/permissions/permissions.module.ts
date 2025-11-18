import { Module } from "@nestjs/common";

import { SqlModule } from "src/sql/sql.module";
import { PermissionsService } from "./permissions.service";

@Module({
  imports: [SqlModule],
  controllers: [],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
