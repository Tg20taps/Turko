import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const outDir = new URL('../public/icons/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const flame = [255, 212, 71, 255];
const ink = [11, 15, 20, 255];
const transparent = [0, 0, 0, 0];

const viewBox = 512;
const cornerRadius = 76;
const textShapes = [
  { type: 'rect', x: 146, y: 170, width: 36, height: 172 },
  { type: 'rect', x: 146, y: 170, width: 86, height: 34 },
  { type: 'rect', x: 146, y: 245, width: 84, height: 34 },
  { type: 'rect', x: 214, y: 190, width: 36, height: 62 },
  {
    type: 'polygon',
    points: [
      [183, 274],
      [219, 274],
      [258, 342],
      [219, 342],
    ],
  },
  { type: 'rect', x: 276, y: 170, width: 122, height: 34 },
  { type: 'rect', x: 319, y: 170, width: 36, height: 172 },
];

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function drawIcon(size) {
  const pixels = Buffer.alloc((size * 4 + 1) * size);
  const samples = 4;

  function insideRoundedSquare(x, y) {
    const max = viewBox;
    const left = x < cornerRadius;
    const right = x > max - cornerRadius;
    const top = y < cornerRadius;
    const bottom = y > max - cornerRadius;

    if ((left || right) && (top || bottom)) {
      const cx = left ? cornerRadius : max - cornerRadius;
      const cy = top ? cornerRadius : max - cornerRadius;
      const dx = x - cx;
      const dy = y - cy;
      return dx * dx + dy * dy <= cornerRadius * cornerRadius;
    }

    return true;
  }

  function insideRect(shape, x, y) {
    return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height;
  }

  function insidePolygon(points, x, y) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
      const [xi, yi] = points[i];
      const [xj, yj] = points[j];
      const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersects) {
        inside = !inside;
      }
    }
    return inside;
  }

  function insideText(x, y) {
    return textShapes.some((shape) =>
      shape.type === 'rect' ? insideRect(shape, x, y) : insidePolygon(shape.points, x, y),
    );
  }

  function sampleColor(x, y) {
    if (!insideRoundedSquare(x, y)) {
      return transparent;
    }
    return insideText(x, y) ? ink : flame;
  }

  for (let y = 0; y < size; y += 1) {
    const row = y * (size * 4 + 1);
    pixels[row] = 0;
    for (let x = 0; x < size; x += 1) {
      const channels = [0, 0, 0, 0];
      for (let sy = 0; sy < samples; sy += 1) {
        for (let sx = 0; sx < samples; sx += 1) {
          const ux = ((x + (sx + 0.5) / samples) / size) * viewBox;
          const uy = ((y + (sy + 0.5) / samples) / size) * viewBox;
          const color = sampleColor(ux, uy);
          channels[0] += color[0];
          channels[1] += color[1];
          channels[2] += color[2];
          channels[3] += color[3];
        }
      }
      const i = row + 1 + x * 4;
      pixels[i] = Math.round(channels[0] / (samples * samples));
      pixels[i + 1] = Math.round(channels[1] / (samples * samples));
      pixels[i + 2] = Math.round(channels[2] / (samples * samples));
      pixels[i + 3] = Math.round(channels[3] / (samples * samples));
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(pixels)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function svgIcon() {
  return `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="76" fill="#FFD447"/>
  <text
    x="256"
    y="264"
    fill="#0B0F14"
    dominant-baseline="middle"
    font-family="Inter, Arial, sans-serif"
    font-size="168"
    font-weight="900"
    letter-spacing="0"
    text-anchor="middle"
  >RT</text>
</svg>
`;
}

for (const size of [180, 192, 512]) {
  const name = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`;
  writeFileSync(new URL(name, outDir), drawIcon(size));
}

writeFileSync(new URL('rikki-icon.svg', outDir), svgIcon());
