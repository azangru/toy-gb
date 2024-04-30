import { getData } from './data-fetcher';

import SolidRectangle from '../../shapes/solid-rectangle';
import EmptyRectangle from '../../shapes/empty-rectangle';
import Line from '../../shapes/line';

import type { Viewport } from '../../types/viewport';
import type { Transcript } from '../../../../../shared/types/transcript';
import type { Shape } from '../../shapes/shape-types';

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
    .filter(transcript => transcript.transcript_designation === 'canonical' || transcript.transcript_designation === 'mane_select');

  const viewportRange = params.viewport.end - params.viewport.start;

  // Low resolution at high scale (starting at 2^19 nucleotides):
  // if (viewportRange >= 2**19) {
  //   return canonicalTranscripts.map(transcript => {
  //     return new SolidRectangle({
  //       x: transcript.start,
  //       y: 0,
  //       width: transcript.end - transcript.start,
  //       height: 10,
  //       color: 'red'
  //     });
  //   });
  // }

  const shapes: Shape[] = [];

  for (const transcript of canonicalTranscripts) {
    const { start, thick_start, thick_end, block_starts, block_sizes } = transcript;
    const isNonCodingTranscript = thick_start === thick_end;

    for (let i = 0; i < block_starts.length; i++) {
      const blockStart = start + block_starts[i];
      const blockLength = block_sizes[i];

      const isNonCodingExon = blockStart > thick_end ||
        blockStart + blockLength < thick_start;
      const isCodingExon = blockStart >= thick_start &&
        blockStart + blockLength <= thick_end;

      if (isNonCodingTranscript || isNonCodingExon) {
        const exon = new EmptyRectangle({
          x: blockStart,
          y: 0,
          width: blockLength,
          height: 8,
          strokeColor: 'red'
        });
        shapes.push(exon);
      } else if (isCodingExon) {
        const exon = new SolidRectangle({
          x: blockStart,
          y: 0,
          width: blockLength,
          height: 8,
          color: 'red'
        });
        shapes.push(exon);
      } else if (blockStart < thick_start) {
        // left part non-coding; right part coding
        const nonCodingStart = blockStart;
        const nonCodingEnd = thick_start;
        const nonCodingPart = new EmptyRectangle({
          x: nonCodingStart,
          y: 0,
          width: nonCodingEnd - nonCodingStart,
          height: 8,
          strokeColor: 'red'
        });
        shapes.push(nonCodingPart);
        const codingStart = thick_start;
        const codingPart = new SolidRectangle({
          x: codingStart,
          y: 0,
          width: blockStart + blockLength - codingStart,
          height: 8,
          color: 'red'
        });
        shapes.push(codingPart);
      } else {
        // left part coding; right part non-coding
        const codingStart = blockStart;
        const codingEnd = thick_end;
        const codingPart = new SolidRectangle({
          x: codingStart,
          y: 0,
          width: codingEnd - codingStart,
          height: 8,
          color: 'red'
        });
        shapes.push(codingPart);
        const nonCodingStart = thick_end;
        const nonCodingPart = new EmptyRectangle({
          x: nonCodingStart,
          y: 0,
          width: blockStart + blockLength - nonCodingStart,
          height: 8,
          strokeColor: 'red'
        });
        shapes.push(nonCodingPart);
      }

      for (let i = 1; i < block_starts.length; i++) {
        const prevBlockEnd = start + block_starts[i - 1] + block_sizes[i - 1];
        const nextBlockStart = start + block_starts[i];

        const line = new Line({
          xStart: prevBlockEnd,
          xEnd: nextBlockStart,
          yStart: 4,
          yEnd: 4,
          color: 'red'
        })
        shapes.push(line);
      }
    }
  }

  return shapes;
};
