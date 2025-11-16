import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ActivateBodyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  token: string;
}
