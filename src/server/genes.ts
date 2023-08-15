import  { BigBed } from '@gmod/bbi';
import BED from '@gmod/bed';
import { RemoteFile, LocalFile } from 'generic-filehandle';

// const filePath = 'https://ensembl-2020-gb-flatfiles.s3.eu-west-2.amazonaws.com/upload-20220829/genes_and_transcripts/homo_sapiens_GCA_000001405.28/transcripts.bb';
// const filePath = 'https://ensembl-2020-gb-flatfiles.s3.eu-west-2.amazonaws.com/upload-20220829/regulation/homo_sapiens_GCA_000001405.28/regulatory-features.bb';




const readGenes = async () => {
  try {
    // const file = new BigBed({
    //   filehandle: new RemoteFile(filePath, { fetch: (globalThis as any).fetch }),
    // });
    const file = new BigBed({
      filehandle: new LocalFile(require.resolve('/Users/andrey/development/experiments/toy-gb/data/transcripts.bb')),
    });
    const { autoSql } = await file.getHeader();

    const features = await file.getFeatures('1', 0, 100000)
    const bedParser = new BED({ autoSql });

    const lines = features.map(feature => {
      const { start, end, rest, uniqueId } = feature;
      return bedParser.parseLine(`chr7\t${start}\t${end}\t${rest}`, { uniqueId })
    });

    console.log(JSON.stringify(lines, null, 2));



    // const features = await file.getFeatures('13', 28596603, 32701918);
    // console.log({features});
  } catch (error) {
    console.log('error', error);
  }
};

export default readGenes;
