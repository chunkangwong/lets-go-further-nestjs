import { IsNumberString } from "class-validator";

export class MovieIdParam {
  @IsNumberString({
    no_symbols: true,
  })
  id: string;
}
