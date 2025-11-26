import { IsNumber, Min } from "class-validator";

export class CompressDTO {
  @IsNumber()
  @Min(1)
  quality: number;
}
