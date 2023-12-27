import { fetchData } from './data-fetcher';

import type { Viewport } from "../../types/viewport"

/**
 * - Should request data for the current viewport
 * - Should request data for left and right viewports of same size
 * - Possibly, keep requesting the data for the whole region in the background?
 * - Put retrieved data in a map
 * - Keep track of the retrieved segments
 */


type GenesProgramParams = {
  viewport: Viewport;
  genome_id: string;
  region_name: string;
}


export const geneProgram = async (params: GenesProgramParams) => {
  const { viewport } = params;

  const data = await fetchData({ ...params, track_type: 'gene' });

  return [];
};
