import type { RulerInstance } from './ruler';
import type { SolidRectangleInstance } from './solid-rectangle';

export type Shape = 
  | RulerInstance
  | SolidRectangleInstance;
