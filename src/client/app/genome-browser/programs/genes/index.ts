import { getData } from './data-fetcher';

import SolidRectangle from "../../shapes/solid-rectangle";

import type { Viewport } from '../../types/viewport';
import type { Transcript } from '../../../../../shared/types/transcript';

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
  const data = await getData({ ...params, track_type: 'gene' }) as Transcript[];

  const canonicalTranscripts = data
    .filter(transcript => transcript.transcript_designation === 'canonical');

  return canonicalTranscripts.map(transcript => {
    return new SolidRectangle({
      x: transcript.start,
      y: 0,
      width: transcript.end - transcript.start,
      height: 10,
      color: 'red'
    });
  });
};
