import  { BigBed } from '@gmod/bbi';
import { RemoteFile } from 'generic-filehandle';

const filePath = 'https://ensembl-2020-gb-flatfiles.s3.eu-west-2.amazonaws.com/upload-20220829/genes_and_transcripts/homo_sapiens_GCA_000001405.28/transcripts.bb';
// const filePath = 'https://ensembl-2020-gb-flatfiles.s3.eu-west-2.amazonaws.com/upload-20220829/regulation/homo_sapiens_GCA_000001405.28/regulatory-features.bb';




const readGenes = async () => {
  try {
    const file = new BigBed({
      filehandle: new RemoteFile(filePath, { fetch: (globalThis as any).fetch }),
    });
    const { autoSql } = await file.getHeader();
    // console.log('autoSql', autoSql);



    // const features = await file.getFeatures('13', 28596603, 32701918);
    // console.log({features});
  } catch (error) {
    console.log('error', error);
  }
};

export default readGenes;
