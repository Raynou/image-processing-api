import { WatermarkOptions } from '../types/image-processing.types';

interface Transformations {
  resize?: { width: number; height: number };
  crop?: { width: number; height: number; x: number; y: number };
  rotate?: number;
  filters?: { grayscale: boolean; sepia: boolean };
  mirror?: boolean;
  compress?: { quality: number };
  watermark?: WatermarkOptions;
  upscale?: { width: number; height: number }
}

export class TransformationsDTO {
  //format: 'jpg' | 'jpeg' | 'png'; // Not yet
  transformations: Transformations;
}
