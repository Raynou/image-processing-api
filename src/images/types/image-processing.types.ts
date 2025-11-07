/**
 * FIXME: These types shouldn't be in the same file but if you want to let them
 * here atleast change the filename.
*/
type TransformationHandler = ( // Use this type
  image: Uint8Array,
  params: any,
) => Promise<Uint8Array>;

export type SharpGravity =
  | 'north'
  | 'northeast'
  | 'southeast'
  | 'south'
  | 'southwest'
  | 'west'
  | 'northwest'
  | 'east'
  | 'center'
  | 'centre';

export type WatermarkOptions =
  | {
      type: 'text';
      text: string;
      font?: string;
      size?: number,
      color?: string;
      position?: SharpGravity;
    }
  | {
      type: 'image';
      image: Uint8Array;
      opacity?: number;
      position?: SharpGravity;
    };

export type ImageWatermarkOptions = Omit<
  Extract<WatermarkOptions, { type: 'image' }>,
  'type'
>;

export type TextWatermarkOptions = Omit<
  Extract<WatermarkOptions, { type: 'text' }>,
  'type'
>;
