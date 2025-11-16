import { Test, TestingModule } from "@nestjs/testing";

import { HealthCheckController } from "./healthCheck.controller";
import { HealthCheckService } from "./healthCheck.service";

describe("HealthCheckController", () => {
  let healthCheckModule: TestingModule;

  beforeAll(async () => {
    healthCheckModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
      providers: [HealthCheckService],
    }).compile();
  });

  describe("healthCheck", () => {
    it("should return 4 movies", () => {
      const healthCheckController = healthCheckModule.get(
        HealthCheckController
      );
      expect(healthCheckController.healthCheck()).resolves.toEqual(
        expect.objectContaining({
          status: "available",
        })
      );
    });
  });
});
