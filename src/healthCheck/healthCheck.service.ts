import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthCheckService {
  healthCheck() {
    const env = {
      status: "available",
      system_info: {
        environment: process.env.NODE_ENV,
        version: process.env.VERSION,
      },
    };

    return env;
  }
}
