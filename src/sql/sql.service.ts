import { Injectable, OnModuleInit } from "@nestjs/common";
import { SQL } from "bun";

@Injectable()
export class SqlService implements OnModuleInit {
  public sql: SQL;

  constructor() {
    this.sql = new SQL(process.env.DATABASE_URL);
  }

  async onModuleInit() {
    await this.sql.connect();
  }
}
