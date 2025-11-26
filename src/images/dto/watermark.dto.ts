import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseWatermarkDTO {
  @IsIn(['text', 'image'])
  type: 'text' | 'image';

  @IsIn([
    'north',
    'northeast',
    'southeast',
    'south',
    'southwest',
    'west',
    'northwest',
    'east',
    'center',
    'centre',
  ])
  position: string;
}
export class TextWatermarkDTO extends BaseWatermarkDTO {
  declare type: 'text';

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  font?: string;

  @IsOptional()
  @IsString()
  size?: number;

  @IsOptional()
  @IsString()
  color?: string;
}

export class ImageWatermarkDTO extends BaseWatermarkDTO {
  declare type: 'image';

  /**
   * FIXME(smelly code?):
   * As this parameter isn't needed in the request's body
   * and it's added in your business logic we could be
   * have some smelling code right here.
  */
  @IsOptional()
  image: Uint8Array<ArrayBufferLike>;

  @IsOptional()
  @IsNumber()
  opacity?: number;
}
