import { Test, TestingModule } from "@nestjs/testing";

import { PermissionsModule } from "../permissions/permissions.module";
import { SqlModule } from "../sql/sql.module";
import { SqlService } from "../sql/sql.service";
import { TokensModule } from "../tokens/tokens.module";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let usersModule: TestingModule;

  beforeAll(async () => {
    usersModule = await Test.createTestingModule({
      imports: [PermissionsModule, TokensModule, SqlModule],
      providers: [UsersService],
    }).compile();
  });

  afterAll(async () => {
    await usersModule.get(SqlService).sql`
      DELETE FROM users WHERE email = 'test@test.com'
    `;
  });

  describe("usersService", () => {
    it("getForToken", () => {
      const usersService = usersModule.get(UsersService);
      expect(
        usersService.getForToken("activation", "hellohello")
      ).resolves.toHaveProperty("id");
    });
  });
});
