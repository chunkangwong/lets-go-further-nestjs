import { Module } from "@nestjs/common";

import { SqlService } from "../sql/sql.service";

@Module({
  providers: [SqlService],
  exports: [SqlService],
})
export class SqlModule {}
