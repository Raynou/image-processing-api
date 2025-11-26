import { IsNumber } from "class-validator";

// Maybe you want to create some custom validators
// in order to check that the image width and height
// are greater than the actual image's widith and height
export class UpscaleDTO {
  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}
