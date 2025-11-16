import { Body, Controller, Post, Put } from "@nestjs/common";

import { UsersService } from "./users.service";
import { RegisterBodyDto } from "./dto/registerBody.dto";
import { ActivateBodyDto } from "./dto/activateBody.dto";

@Controller({
  path: "users",
  version: "1",
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() body: RegisterBodyDto) {
    return this.usersService.register(body);
  }

  @Put("activated")
  activate(@Body() body: ActivateBodyDto) {
    return this.usersService.activate(body);
  }
}
