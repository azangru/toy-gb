import { Shape } from "../../shapes/shape-types";

import rulerPainter from './ruler-painter';
import solidRectanglePainter from './solid-rectangle-painter';
import emptyRectanglePainter from './empty-rectangle-painter';
import linePainter from './line-painter';

type PaintersMapType = Record<Shape['type'], any>;

const PaintersMap = {
  'ruler': rulerPainter,
  'solid-rectangle': solidRectanglePainter,
  'empty-rectangle': emptyRectanglePainter,
  'line': linePainter
};

export default PaintersMap;
