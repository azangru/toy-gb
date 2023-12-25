import { Shape } from "../../shapes/shape-types";

import rulerPainter from './ruler-painter';

type PaintersMapType = Record<Shape['type'], any>;

const PaintersMap = {
  'ruler': rulerPainter
};

export default PaintersMap;
