import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { PermissionsModule } from "../permissions/permissions.module";
import { SqlService } from "../sql/sql.service";
import { TokensModule } from "../tokens/tokens.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let usersModule: TestingModule;

  beforeAll(async () => {
    usersModule = await Test.createTestingModule({
      imports: [PermissionsModule, TokensModule],
      controllers: [UsersController],
      providers: [UsersService, SqlService],
    }).compile();
  });

  afterAll(async () => {
    await usersModule.get(SqlService).sql`
      DELETE FROM users WHERE email = 'test@test.com'
    `;
  });

  describe("register", () => {
    it("should return a user", () => {
      const usersController = usersModule.get(UsersController);
      expect(
        usersController.register({
          name: "Test User",
          email: "test@test.com",
          password: "test",
        })
      ).resolves.toHaveProperty("id");
    });
    it("should throw a BadRequestException if the email is already in use", () => {
      const usersController = usersModule.get(UsersController);
      expect(
        usersController.register({
          name: "Test User",
          email: "test@test.com",
          password: "test",
        })
      ).rejects.toThrow(BadRequestException);
    });
  });
});
