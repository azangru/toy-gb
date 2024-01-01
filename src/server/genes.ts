import path from 'node:path';
import * as url from 'node:url';
import  { BigBed } from '@gmod/bbi';
import BED from '@gmod/bed';
import { RemoteFile, LocalFile } from 'generic-filehandle';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


import type { RequestPayload } from '../shared/types/data-request';

// const filePath = 'https://ensembl-2020-gb-flatfiles.s3.eu-west-2.amazonaws.com/upload-20220829/genes_and_transcripts/homo_sapiens_GCA_000001405.28/transcripts.bb';
// const filePath = 'https://ensembl-2020-gb-flatfiles.s3.eu-west-2.amazonaws.com/upload-20220829/regulation/homo_sapiens_GCA_000001405.28/regulatory-features.bb';


type Params = Pick<RequestPayload, 'viewport' | 'genome_id' | 'region_name'>;

const readGenes = async (params: Params) => {
  const { viewport: { start, end }, region_name } = params;
  try {
    // const file = new BigBed({
    //   filehandle: new RemoteFile(filePath, { fetch: (globalThis as any).fetch }),
    // });
    const pathToFile = path.resolve(__dirname, '../../data/transcripts.bb');

    const file = new BigBed({
      filehandle: new LocalFile(pathToFile),
    });
    const { autoSql } = await file.getHeader();

    const features = await file.getFeatures(region_name, start, end);
    const bedParser = new BED({ autoSql });

    const lines = features.map(feature => {
      const { start, end, rest, uniqueId } = feature;
      return bedParser.parseLine(`${region_name}\t${start}\t${end}\t${rest}`, { uniqueId })
    });

    // console.log(lines[0]);

    return lines.map(line => ({
      region_name: line.chrom,
      start: line.chromStart,
      end: line.chromEnd,
      stable_id: line.name,
      unversioned_stable_id: line.unversionedTranscriptId,
      strand: line.strand,
      thick_start: line.thickStart,
      thick_end: line.thickEnd,
      block_sizes: line.blockSizes,
      block_starts: line.blockStarts,
      transcript_start: line.transcriptStart,
      transcript_end: line.transcriptEnd,
      transcript_designation: line.transcriptDesignation,
      gene_stable_id: line.geneId,
      gene_symbol: line.geneName,
      gene_unversioned_stable_id: line.unversionedGeneId
    }));
  } catch (error) {
    console.log('error', error);
  }
};

export default readGenes;
