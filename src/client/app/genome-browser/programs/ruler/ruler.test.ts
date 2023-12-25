import { describe, test } from 'node:test';
import assert from 'node:assert';

import { getRulerTicks } from './intervals';

// 2750000 2752000


describe('getRulerTicks', () => {
  test('start 1; end 10', () => {
    const ticks = getRulerTicks({ startBp: 1, endBp: 10 });
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // const expected = [2, 4, 6, 8];
    console.log('ticks', ticks);
    assert.deepEqual(ticks, expected);
  });
});
