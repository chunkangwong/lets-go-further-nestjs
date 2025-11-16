import { Test, TestingModule } from "@nestjs/testing";

import { SqlService } from "../sql/sql.service";
import { PermissionsService } from "./permissions.service";

describe("MoviesController", () => {
  let permissionsModule: TestingModule;

  beforeAll(async () => {
    permissionsModule = await Test.createTestingModule({
      controllers: [],
      providers: [PermissionsService, SqlService],
    }).compile();
  });

  afterAll(async () => {
    await permissionsModule.get(SqlService).sql`
      DELETE FROM users_permissions WHERE user_id = 1 AND permission_id = 2
    `;
  });

  describe("addForUser", () => {
    it("should add the permissions to the user", async () => {
      const permissionsService = permissionsModule.get(PermissionsService);
      await permissionsService.addForUser(1, ["movies:write"]);
      const permissions = await permissionsService.getAllForUser(1);
      expect(permissions).toEqual(["movies:read", "movies:write"]);
    });
  });
});
