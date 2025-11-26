import { IsInt, Min } from 'class-validator';

export class ResizeDTO {
  @IsInt()
  @Min(1)
  width: number;
  
  @IsInt()
  @Min(1)
  height: number;
}
