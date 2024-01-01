import type { RequestPayload } from '../../../../../shared/types/data-request';


export const fetchData = async (payload: RequestPayload) => {
  const url = 'http://localhost:3000/data';
  const data = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload)
  }).then(response => response.json());

  return data;
};

export const getData = async (payload: RequestPayload) => {
  const { viewport } = payload;
  const { start, end } = viewport;

  const requestMatches = [...requestedSlices.entries()].filter(([ key ]) => {
    const coords = key.split(',').map(coord => parseInt(coord, 10));
    const [ reqStart, reqEnd ] = coords;
    return reqStart <= start && reqEnd >= start ||  // overlaps left or overlaps both ends
      reqStart < end && reqEnd > start; // is inside the segment, or overlaps right
  });

  const requestedSegments = requestMatches
    .map(([key]) => key.split(',').map(i => parseInt(i))) as [number, number][];

  const missingSegments = getMissingSegments(viewport, requestedSegments);

  const ongoingRequestPromises = requestMatches
    .filter(([, value]) => value instanceof Promise)
    .map(([, value]) => value);

  const missingSegmentRequestPromises = missingSegments
    .map(segment => fetchData({
      ...payload,
      viewport: { start: segment[0], end: segment[1] }
    }).then(data => {
      const [ segmentStart, segmentEnd ] = segment;
      const mapKey = `${segmentStart},${segmentEnd}`;
      requestedSlices.set(mapKey, true);

      // save the retrieved data
      outerLoop: for (const feature of data) {
        if (!features.length) {
          features.push(feature);
          continue;
        }

        let indexBeforeInsertion = -1;

        for (let i = 0; i < features.length; i++) {
          const curFeature = features[i];
          if (feature.stable_id === curFeature.stable_id) {
            continue outerLoop;
          }
          if (curFeature.start <= feature.start) {
            indexBeforeInsertion = i;
          }
        }

        if (indexBeforeInsertion === -1) {
          features.unshift(feature);
        } else {
          const insertionIndex = indexBeforeInsertion + 1;
          features.splice(insertionIndex, 0, feature);
        }
      }
    }));

  for (let i = 0; i < missingSegments.length; i++) {
    const segment = missingSegments[i];
    const [segmentStart, segmentEnd] = segment;
    const mapKey = `${segmentStart},${segmentEnd}`;
    requestedSlices.set(mapKey, missingSegmentRequestPromises[i]);
  }

  await Promise.all([...ongoingRequestPromises, ...missingSegmentRequestPromises]);

  // read features
  return features.filter(feature => feature.end >= start && feature.start < end);
};

/**
     |--------------|
     |--------------|
  |--------------|
               |--------------|
          |-----|
 */

const getMissingSegments = (viewport: { start: number, end: number }, requestedSegments: [number, number][]) => {
  let missingSegments = [];

  // Sort requested segments by start position
  requestedSegments.sort((a, b) => a[0] - b[0]);

  // Q: What if there are no segments in the requestedSegments array?
  if (!requestedSegments.length) {
    return [[viewport.start, viewport.end]];
  }

  // Iterate through requested segments array and find any gaps between them.
  // If such gaps exist, add them to the list of missing segments
  const firstRequestedSegment = requestedSegments[0];

  let currentStart = firstRequestedSegment[0];
  let currentEnd = firstRequestedSegment[1];

  let minStart = currentStart;
  let maxEnd = currentEnd;

  for (const segment of requestedSegments) {
    const [ segmentStart, segmentEnd ] = segment;
    if (segmentEnd > currentEnd) {
      maxEnd = segmentEnd;
    }


    if (segmentStart < currentEnd && segmentEnd > currentEnd) {
      currentEnd = segmentEnd;
    } else if (segmentStart === currentEnd || segmentStart === currentEnd + 1) {
      currentStart = segmentStart;
      currentEnd = segmentEnd;
    } else if (segmentStart > currentEnd) {
      missingSegments.push([currentEnd, segmentStart]);
      currentStart = segmentStart;
      currentEnd = segmentEnd;
    }
  }

  const viewportRange = viewport.end - viewport.start;

  if (viewport.start < minStart) {
    missingSegments.unshift([
      Math.min(minStart - viewportRange - 1, 1),
      minStart - 1
    ]);
  }

  if (viewport.end > maxEnd) {
    missingSegments.push([
      maxEnd + 1,
      maxEnd + 1 + viewportRange
    ])
  }


  return missingSegments;
};


/**
 * A map of requests that stores promises while requests are in flight:
 * requestsMap = {
 *  [100-200]: Promise | true
 * }
 */
const requestedSlices = new Map<string, Promise<unknown> | boolean>();

const features: ({start: number, end: number} & Record<string, unknown>)[] = [];
