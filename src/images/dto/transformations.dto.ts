import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { ResizeDTO } from './resize.dto';
import { Type } from 'class-transformer';
import { CropDTO } from './crop.dto';
import { CompressDTO } from './compress.dto';
import { UpscaleDTO } from './upscale.dto';
import { FiltersDTO } from './filters.dto';
import {
  BaseWatermarkDTO,
  ImageWatermarkDTO,
  TextWatermarkDTO,
} from './watermark.dto';

class Transformations {
  @ValidateNested()
  @Type(() => ResizeDTO)
  @IsOptional()
  resize?: ResizeDTO;

  @ValidateNested()
  @Type(() => CropDTO)
  @IsOptional()
  crop?: CropDTO;

  @IsNumber()
  @Min(1)
  @IsOptional()
  rotate?: number;

  @ValidateNested()
  @Type(() => FiltersDTO)
  @IsOptional()
  filters?: FiltersDTO;

  @IsBoolean()
  @IsOptional()
  mirror?: boolean;

  @ValidateNested()
  @Type(() => CompressDTO)
  @IsOptional()
  compress?: CompressDTO;

  @Type(() => BaseWatermarkDTO, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: TextWatermarkDTO, name: 'text' },
        { value: ImageWatermarkDTO, name: 'image' },
      ],
    },
  })
  @IsOptional()
  watermark?: TextWatermarkDTO | ImageWatermarkDTO;

  @ValidateNested()
  @Type(() => UpscaleDTO)
  @IsOptional()
  upscale?: UpscaleDTO;
}

export class TransformationsDTO {
  @ValidateNested()
  @Type(() => Transformations)
  @IsObject()
  transformations: Transformations;
}
