export type RequestPayload = {
  viewport: {
    start: number;
    end: number;
  },
  genome_id: string;
  region_name: string;
  track_type: string;
  extraParameters?: Record<string, unknown>
}
