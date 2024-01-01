import { Shape } from "../../shapes/shape-types";

import rulerPainter from './ruler-painter';
import solidRectanglePainter from './solid-rectangle-painter';

type PaintersMapType = Record<Shape['type'], any>;

const PaintersMap = {
  'ruler': rulerPainter,
  'solid-rectangle': solidRectanglePainter
};

export default PaintersMap;
