import { IsNumber, Min } from "class-validator";

export class CropDTO {
  @IsNumber()
  @Min(1)
  width: number;
  
  @IsNumber()
  @Min(1)
  height: number;

  @IsNumber()
  @Min(1)
  x: number;

  @IsNumber()
  @Min(1)
  y: number;
}
