import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  year: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  runtime: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ArrayUnique()
  genres: string[];
}
