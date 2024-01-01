import Ruler from "../../shapes/ruler";

import { getRulerTicks } from './intervals';

import type { Viewport } from "../../types/viewport"

type RulerProgramParams = {
  viewport: Viewport
}

const rulerProgram = async (params: RulerProgramParams) => {
  const { viewport } = params;
  const rulerTicks = getRulerTicks({ startBp: viewport.start, endBp: viewport.end });

  const rulerShape = new Ruler(rulerTicks);

  return [
    rulerShape
  ];
};

export default rulerProgram;
