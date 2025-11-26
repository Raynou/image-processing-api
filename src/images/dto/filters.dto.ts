import { IsBoolean, IsOptional } from "class-validator";
import { IsExactlyOneTrue } from "../decorators/is-exactly-one.decorator";

export class FiltersDTO {
  @IsBoolean()
  @IsOptional()
  @IsExactlyOneTrue()
  grayscale: boolean;

  @IsBoolean()
  @IsOptional()
  sepia: boolean;
}
