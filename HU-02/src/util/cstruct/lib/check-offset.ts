'use strict';

function isInteger(value) {
  if (typeof value !== 'number') {
    return false;
  }
  if (!isFinite(value)) {
    return false;
  }
  if (Math.floor(value) !== value) {
    return false;
  }

  return true;
}

function checkOffset(offset, ext, length) {
  if (isInteger(offset) === false) {
    throw new TypeError('expected integer offset');
  }

  if (offset < 0 || offset + ext > length) {
    throw new RangeError('index out of range');
  }
}

export default checkOffset;
