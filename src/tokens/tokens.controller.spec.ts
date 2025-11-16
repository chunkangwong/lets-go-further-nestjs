import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { SqlService } from "../sql/sql.service";
import { TokensController } from "./tokens.controller";
import { TokensService } from "./tokens.service";

describe("TokensController", () => {
  let tokensModule: TestingModule;

  beforeAll(async () => {
    tokensModule = await Test.createTestingModule({
      controllers: [TokensController],
      providers: [TokensService, SqlService],
    }).compile();
  });

  describe("authentication", () => {
    it("should return a token", () => {
      const tokensController = tokensModule.get(TokensController);
      expect(
        tokensController.authentication({
          email: "hello@local.com",
          password: "hellohello",
        })
      ).resolves.toHaveProperty("authentication_token");
    });

    it("should throw a UnauthorizedException if the email or password is incorrect", () => {
      const tokensController = tokensModule.get(TokensController);
      expect(
        tokensController.authentication({
          email: "hello@local.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
