import { Module } from "@nestjs/common";

import { SqlService } from "../sql.service";
import { TokensController } from "./tokens.controller";
import { TokensService } from "./tokens.service";

@Module({
  imports: [],
  controllers: [TokensController],
  providers: [TokensService, SqlService],
  exports: [TokensService],
})
export class TokensModule {}
