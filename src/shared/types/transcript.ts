// fields as stored in a bed file
export type TranscriptFromBed = {
  chrom: string;
  chromStart: number;
  chromEnd: number;
  name: string;
  strand: number;
  thickStart: number;
  thickEnd: number;
  blockCount: number;
  blockSizes: number[];
  blockStarts: number[];
  transcriptStart: number;
  transcriptEnd: number;
  transcriptBiotype: string;
  transcriptDesignation: string;
  geneId: string;
  geneName: string;
  base64GeneDescription: string;
  geneBiotype: string;
  unversionedGeneId: string;
  unversionedTranscriptId: string;
  translationLength: number;
};

// shape of the data sent to the client 
export type Transcript = {
  stable_id: string;
  unversioned_stable_id: string;
  region_name: string;
  start: number;
  end: number;
  strand: number;
  thick_start: number;
  thick_end: number;
  block_sizes: number[];
  block_starts: number[];
  transcript_start: number;
  transcript_end: number;
  transcript_designation: string;
  gene_stable_id: string;
  gene_symbol: string;
  gene_unversioned_stable_id: string;
};
