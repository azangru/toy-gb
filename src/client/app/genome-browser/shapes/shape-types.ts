import type { RulerInstance } from './ruler';
import type { SolidRectangleInstance } from './solid-rectangle';
import type { EmptyRectangleInstance } from './empty-rectangle';
import type { LineInstance } from './line';

export type Shape = 
  | RulerInstance
  | SolidRectangleInstance
  | EmptyRectangleInstance
  | LineInstance;
