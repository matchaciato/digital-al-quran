const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createPNG(width, height) {
  // RGBA buffer with 1 filter byte per row
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;
  const innerRadius = width * 0.32;

  // Background emerald: #1B4D3E (27, 77, 62)
  // Gold accent: #F59E0B (245, 158, 11)
  // Off-white: #FAF8F5 (250, 248, 245)

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Rounded background square
      const cornerR = width * 0.22;
      const insideBox = (
        (Math.abs(dx) <= cx - cornerR && Math.abs(dy) <= cy) ||
        (Math.abs(dy) <= cy - cornerR && Math.abs(dx) <= cx) ||
        (Math.hypot(Math.abs(dx) - (cx - cornerR), Math.abs(dy) - (cy - cornerR)) <= cornerR)
      );

      if (!insideBox) {
        // Transparent outside
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
        continue;
      }

      // Inside icon
      if (Math.abs(dist - radius * 0.88) < width * 0.02) {
        // Gold geometric circle border
        rawData[pixelOffset] = 245;
        rawData[pixelOffset + 1] = 158;
        rawData[pixelOffset + 2] = 11;
        rawData[pixelOffset + 3] = 255;
      } else if (dist <= innerRadius * 0.75) {
        // Center crescent/star/book motif representation in gold
        const isBook = Math.abs(dx) <= innerRadius * 0.55 && Math.abs(dy) <= innerRadius * 0.45 && (Math.abs(dx) > width * 0.015 || Math.abs(dy) > width * 0.1);
        if (isBook) {
          rawData[pixelOffset] = 245;
          rawData[pixelOffset + 1] = 191;
          rawData[pixelOffset + 2] = 36;
          rawData[pixelOffset + 3] = 255;
        } else {
          rawData[pixelOffset] = 27;
          rawData[pixelOffset + 1] = 77;
          rawData[pixelOffset + 2] = 62;
          rawData[pixelOffset + 3] = 255;
        }
      } else {
        // Emerald background
        rawData[pixelOffset] = 27;
        rawData[pixelOffset + 1] = 77;
        rawData[pixelOffset + 2] = 62;
        rawData[pixelOffset + 3] = 255;
      }
    }
  }

  // Deflate IDAT
  const compressed = zlib.deflateSync(rawData);

  // PNG Header
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT Chunk
  const idatChunk = createChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(length + 12);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, length + 8));
  chunk.writeUInt32BE(crc, length + 8);
  return chunk;
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const publicDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512));
console.log('Successfully generated pwa-192x192.png and pwa-512x512.png');
