'use strict';

import { Buffer } from 'buffer';

function arrayRead(endianness, type, count, buffer, offset) {
  const result = new Array(count);
  const size = type.byteLength;

  for (let i = 0; i < count; i++) {
    result[i] = type['read' + endianness](buffer, offset + i * size);
  }

  return result;
}

function arrayWrite(endianness, type, count, data, targetBuffer, targetOffset) {
  const size = type.byteLength;
  const buffer =
    targetBuffer === null ? Buffer.alloc(size * count) : targetBuffer;
  const offset = targetBuffer === null ? 0 : targetOffset;

  for (let i = 0; i < count; i++) {
    type['write' + endianness](data[i], buffer, offset + i * size);
  }

  return buffer;
}

const readLE = function readLE(type, count, buffer, offset) {
  return arrayRead('LE', type, count, buffer, offset);
};

const readBE = function readBE(type, count, buffer, offset) {
  return arrayRead('BE', type, count, buffer, offset);
};

const writeLE = function writeLE(
  type,
  count,
  data,
  targetBuffer,
  targetOffset,
) {
  return arrayWrite('LE', type, count, data, targetBuffer, targetOffset);
};

const writeBE = function writeBE(
  type,
  count,
  data,
  targetBuffer,
  targetOffset,
) {
  return arrayWrite('BE', type, count, data, targetBuffer, targetOffset);
};

const array = {
  readBE,
  readLE,
  writeBE,
  writeLE,
};

export default array;
