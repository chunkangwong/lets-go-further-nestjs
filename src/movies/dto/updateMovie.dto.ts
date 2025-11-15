import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateMovieDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNumber()
  @IsPositive()
  year: number;

  @IsNumber()
  @IsPositive()
  runtime: number;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ArrayUnique()
  genres: string[];
}
