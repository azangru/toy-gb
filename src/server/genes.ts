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

    return lines;
  } catch (error) {
    console.log('error', error);
  }
};

export default readGenes;
