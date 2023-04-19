import {Buffer} from 'buffer';
const sbox = Buffer.from([
  //0     1    2      3     4    5     6     7      8    9     A      B    C     D     E     F
  0x63,
  0x7c,
  0x77,
  0x7b,
  0xf2,
  0x6b,
  0x6f,
  0xc5,
  0x30,
  0x01,
  0x67,
  0x2b,
  0xfe,
  0xd7,
  0xab,
  0x76, //0
  0xca,
  0x82,
  0xc9,
  0x7d,
  0xfa,
  0x59,
  0x47,
  0xf0,
  0xad,
  0xd4,
  0xa2,
  0xaf,
  0x9c,
  0xa4,
  0x72,
  0xc0, //1
  0xb7,
  0xfd,
  0x93,
  0x26,
  0x36,
  0x3f,
  0xf7,
  0xcc,
  0x34,
  0xa5,
  0xe5,
  0xf1,
  0x71,
  0xd8,
  0x31,
  0x15, //2
  0x04,
  0xc7,
  0x23,
  0xc3,
  0x18,
  0x96,
  0x05,
  0x9a,
  0x07,
  0x12,
  0x80,
  0xe2,
  0xeb,
  0x27,
  0xb2,
  0x75, //3
  0x09,
  0x83,
  0x2c,
  0x1a,
  0x1b,
  0x6e,
  0x5a,
  0xa0,
  0x52,
  0x3b,
  0xd6,
  0xb3,
  0x29,
  0xe3,
  0x2f,
  0x84, //4
  0x53,
  0xd1,
  0x00,
  0xed,
  0x20,
  0xfc,
  0xb1,
  0x5b,
  0x6a,
  0xcb,
  0xbe,
  0x39,
  0x4a,
  0x4c,
  0x58,
  0xcf, //5
  0xd0,
  0xef,
  0xaa,
  0xfb,
  0x43,
  0x4d,
  0x33,
  0x85,
  0x45,
  0xf9,
  0x02,
  0x7f,
  0x50,
  0x3c,
  0x9f,
  0xa8, //6
  0x51,
  0xa3,
  0x40,
  0x8f,
  0x92,
  0x9d,
  0x38,
  0xf5,
  0xbc,
  0xb6,
  0xda,
  0x21,
  0x10,
  0xff,
  0xf3,
  0xd2, //7
  0xcd,
  0x0c,
  0x13,
  0xec,
  0x5f,
  0x97,
  0x44,
  0x17,
  0xc4,
  0xa7,
  0x7e,
  0x3d,
  0x64,
  0x5d,
  0x19,
  0x73, //8
  0x60,
  0x81,
  0x4f,
  0xdc,
  0x22,
  0x2a,
  0x90,
  0x88,
  0x46,
  0xee,
  0xb8,
  0x14,
  0xde,
  0x5e,
  0x0b,
  0xdb, //9
  0xe0,
  0x32,
  0x3a,
  0x0a,
  0x49,
  0x06,
  0x24,
  0x5c,
  0xc2,
  0xd3,
  0xac,
  0x62,
  0x91,
  0x95,
  0xe4,
  0x79, //A
  0xe7,
  0xc8,
  0x37,
  0x6d,
  0x8d,
  0xd5,
  0x4e,
  0xa9,
  0x6c,
  0x56,
  0xf4,
  0xea,
  0x65,
  0x7a,
  0xae,
  0x08, //B
  0xba,
  0x78,
  0x25,
  0x2e,
  0x1c,
  0xa6,
  0xb4,
  0xc6,
  0xe8,
  0xdd,
  0x74,
  0x1f,
  0x4b,
  0xbd,
  0x8b,
  0x8a, //C
  0x70,
  0x3e,
  0xb5,
  0x66,
  0x48,
  0x03,
  0xf6,
  0x0e,
  0x61,
  0x35,
  0x57,
  0xb9,
  0x86,
  0xc1,
  0x1d,
  0x9e, //D
  0xe1,
  0xf8,
  0x98,
  0x11,
  0x69,
  0xd9,
  0x8e,
  0x94,
  0x9b,
  0x1e,
  0x87,
  0xe9,
  0xce,
  0x55,
  0x28,
  0xdf, //E
  0x8c,
  0xa1,
  0x89,
  0x0d,
  0xbf,
  0xe6,
  0x42,
  0x68,
  0x41,
  0x99,
  0x2d,
  0x0f,
  0xb0,
  0x54,
  0xbb,
  0x16, //F
]);

// inverse sbox
const rsbox = Buffer.from([
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81,
  0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e,
  0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23,
  0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66,
  0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72,
  0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65,
  0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46,
  0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a,
  0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca,
  0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91,
  0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6,
  0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
  0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f,
  0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2,
  0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8,
  0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93,
  0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb,
  0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6,
  0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d,
]);

// round constant
const Rcon = Buffer.from([
  0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36,
]);

// multiply by 2 in the galois field
function galois_mul2(value: number): number {
  // cast to signed value
  let temp = value & 0xff;
  // if MSB is 1, then this will signed extend and fill the temp variable with 1's
  // temp = (temp - 256) >> 7;
  if (temp & 0x80) {
    temp = 0xff;
  } else {
    temp = 0x00;
  }
  // AND with the reduction variable
  temp = temp & 0x1b;
  // finally shift and reduce the value
  return ((value << 1) ^ temp) & 0xff;
}

// AES encryption and decryption function
// The code was optimized for memory (flash and ram)
// Combining both encryption and decryption resulted in a slower implementation
// but much smaller than the 2 functions separated
// This function only implements AES-128 encryption and decryption (AES-192 and
// AES-256 are not supported by this code)

export function aes_enc_dec(
  state: Buffer,
  offset: number,
  key: Buffer,
  dir: number,
) {
  let round: number;
  let i: number;
  let buf1: number;
  let buf2: number;
  let buf3: number;
  let buf4: number;

  // In case of decryption
  if (dir) {
    // compute the last key of encryption before starting the decryption
    for (round = 0; round < 10; round++) {
      //key schedule
      key[0] = sbox[key[13]] ^ key[0] ^ Rcon[round];
      key[1] = sbox[key[14]] ^ key[1];
      key[2] = sbox[key[15]] ^ key[2];
      key[3] = sbox[key[12]] ^ key[3];
      for (i = 4; i < 16; i++) {
        key[i] = key[i] ^ key[i - 4];
      }
    }

    //first Addroundkey
    for (i = 0; i < 16; i++) {
      state[i + offset] = state[i + offset] ^ key[i];
    }
  }

  // main loop
  for (round = 0; round < 10; round++) {
    if (dir) {
      //Inverse key schedule
      for (i = 15; i > 3; --i) {
        key[i] = key[i] ^ key[i - 4];
      }
      key[0] = sbox[key[13]] ^ key[0] ^ Rcon[9 - round];
      key[1] = sbox[key[14]] ^ key[1];
      key[2] = sbox[key[15]] ^ key[2];
      key[3] = sbox[key[12]] ^ key[3];
    } else {
      for (i = 0; i < 16; i++) {
        // with shiftrow i+5 mod 16
        state[i + offset] = sbox[state[i + offset] ^ key[i]];
      }
      //shift rows
      buf1 = state[1 + offset];
      state[1 + offset] = state[5 + offset];
      state[5 + offset] = state[9 + offset];
      state[9 + offset] = state[13 + offset];
      state[13 + offset] = buf1;

      buf1 = state[2 + offset];
      buf2 = state[6 + offset];
      state[2 + offset] = state[10 + offset];
      state[6 + offset] = state[14 + offset];
      state[10 + offset] = buf1;
      state[14 + offset] = buf2;

      buf1 = state[15 + offset];
      state[15 + offset] = state[11 + offset];
      state[11 + offset] = state[7 + offset];
      state[7 + offset] = state[3 + offset];
      state[3 + offset] = buf1;
    }
    //mixcol - inv mix
    if ((round > 0 && dir) || (round < 9 && !dir)) {
      for (i = 0; i < 4; i++) {
        buf4 = i << 2;
        if (dir) {
          // precompute for decryption
          buf1 = galois_mul2(
            galois_mul2(state[buf4 + offset] ^ state[buf4 + 2 + offset]),
          );
          buf2 = galois_mul2(
            galois_mul2(state[buf4 + 1 + offset] ^ state[buf4 + 3 + offset]),
          );
          state[buf4 + offset] ^= buf1;
          state[buf4 + 1 + offset] ^= buf2;
          state[buf4 + 2 + offset] ^= buf1;
          state[buf4 + 3 + offset] ^= buf2;
        }
        // in all cases
        buf1 =
          state[buf4 + offset] ^
          state[buf4 + 1 + offset] ^
          state[buf4 + 2 + offset] ^
          state[buf4 + 3 + offset];
        buf2 = state[buf4 + offset];
        buf3 = state[buf4 + offset] ^ state[buf4 + 1 + offset];
        buf3 = galois_mul2(buf3);
        state[buf4 + offset] = state[buf4 + offset] ^ buf3 ^ buf1;
        buf3 = state[buf4 + 1 + offset] ^ state[buf4 + 2 + offset];
        buf3 = galois_mul2(buf3);
        state[buf4 + 1 + offset] = state[buf4 + 1 + offset] ^ buf3 ^ buf1;
        buf3 = state[buf4 + 2 + offset] ^ state[buf4 + 3 + offset];
        buf3 = galois_mul2(buf3);
        state[buf4 + 2 + offset] = state[buf4 + 2 + offset] ^ buf3 ^ buf1;
        buf3 = state[buf4 + 3 + offset] ^ buf2;
        buf3 = galois_mul2(buf3);
        state[buf4 + 3 + offset] = state[buf4 + 3 + offset] ^ buf3 ^ buf1;
      }
    }

    if (dir) {
      //Inv shift rows
      // Row 1
      buf1 = state[13 + offset];
      state[13 + offset] = state[9 + offset];
      state[9 + offset] = state[5 + offset];
      state[5 + offset] = state[1 + offset];
      state[1 + offset] = buf1;
      //Row 2
      buf1 = state[10 + offset];
      buf2 = state[14 + offset];
      state[10 + offset] = state[2 + offset];
      state[14 + offset] = state[6 + offset];
      state[2 + offset] = buf1;
      state[6 + offset] = buf2;
      //Row 3
      buf1 = state[3 + offset];
      state[3 + offset] = state[7 + offset];
      state[7 + offset] = state[11 + offset];
      state[11 + offset] = state[15 + offset];
      state[15 + offset] = buf1;

      for (i = 0; i < 16; i++) {
        // with shiftrow i+5 mod 16
        state[i + offset] = rsbox[state[i + offset]] ^ key[i];
      }
    } else {
      //key schedule
      key[0] = sbox[key[13]] ^ key[0] ^ Rcon[round];
      key[1] = sbox[key[14]] ^ key[1];
      key[2] = sbox[key[15]] ^ key[2];
      key[3] = sbox[key[12]] ^ key[3];
      for (i = 4; i < 16; i++) {
        key[i] = key[i] ^ key[i - 4];
      }
    }
  }
  if (!dir) {
    //last Addroundkey
    for (i = 0; i < 16; i++) {
      // with shiftrow i+5 mod 16
      state[i + offset] = state[i + offset] ^ key[i];
    } // enf for
  } // end if (!dir)
} // end function
// 0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6, 0xab, 0xf7, 0x15, 0x88,
//       0x09, 0xcf, 0x4f, 0x3c,
export function aes_128_en(
  keyAes: Buffer,
  data: Buffer,
  offset: number,
  num?: number,
) {
  const number_code = num ? num : 1;
  for (let i = 0; i < number_code; i++) {
    let key = Buffer.from(keyAes);
    aes_enc_dec(data, offset, key, 0);
    offset += 16;
  }
}
export function aes_128_dec(
  keyAes: Buffer,
  data: Buffer,
  offset: number,
  num?: number,
) {
  const number_code = num ? num : 1;
  for (let i = 0; i < number_code; i++) {
    let key = Buffer.from(keyAes);
    aes_enc_dec(data, offset, key, 1);
    offset += 16;
  }
}
