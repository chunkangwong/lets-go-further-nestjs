import { Controller, Get } from "@nestjs/common";

import { HealthCheckService } from "./healthCheck.service";

@Controller({
  path: "healthCheck",
  version: "1",
})
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  async healthCheck() {
    return this.healthCheckService.healthCheck();
  }
}
