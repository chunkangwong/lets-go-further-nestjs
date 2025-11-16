import { Body, Controller, Post } from "@nestjs/common";

import { AuthenticateBodyDto as AuthenticationBodyDto } from "./dto/authenticateBody.dto";
import { TokensService } from "./tokens.service";

@Controller({
  path: "tokens",
  version: "1",
})
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post("authentication")
  async authentication(@Body() body: AuthenticationBodyDto) {
    const token = await this.tokensService.authentication(body);
    return {
      authentication_token: token,
    };
  }
}
