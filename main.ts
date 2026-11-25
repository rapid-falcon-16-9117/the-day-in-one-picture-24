// the-day-in-one-picture-24 — entry program for make.fun's news-image-20261124.
//
// Beside this file sits entry.png: a single newspaper front page that sums
// up the world news of Tuesday 24 November 2026, drawn as HTML in
// design/frontpage.html and rendered to a 1024x1024 PNG. This program is
// the delivery boy, but a picky one: before handing the picture over it
// confirms the file is a real PNG or JPEG (by its magic bytes, never by
// its name), that it weighs no more than 1 MiB, and that neither side
// runs past 1024 pixels. Anything wrong and it stops with exit code 1
// rather than submit a picture the rules would reject.
//
// Run:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Node 22, standard library only, no network.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BYTE_LIMIT = 1_048_576; // 1 MiB — the competition's file-size cap
const SIDE_LIMIT = 1024; // width and height may each be at most this

const home = dirname(fileURLToPath(import.meta.url));
const picturePath = join(home, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const destination = join(outDir, "entry.png");

function refuse(reason: string): never {
  console.error(`the-day-in-one-picture-24: ${reason}`);
  process.exit(1);
}

const picture = readFileSync(picturePath);

// Weight first: an empty file is not a picture, and an overweight one is
// not allowed no matter what it contains.
if (picture.length === 0) refuse("entry.png is empty");
if (picture.length > BYTE_LIMIT) {
  refuse(`entry.png weighs ${picture.length} bytes, over the ${BYTE_LIMIT}-byte limit`);
}

// Format by signature: PNG opens with 89 50 4E 47 0D 0A 1A 0A, JPEG with
// FF D8 FF. The file is called entry.png either way, so the bytes decide.
const looksPng =
  picture.length >= 8 &&
  picture[0] === 0x89 && picture[1] === 0x50 && picture[2] === 0x4e && picture[3] === 0x47 &&
  picture[4] === 0x0d && picture[5] === 0x0a && picture[6] === 0x1a && picture[7] === 0x0a;
const looksJpeg =
  picture.length >= 3 &&
  picture[0] === 0xff && picture[1] === 0xd8 && picture[2] === 0xff;

if (!looksPng && !looksJpeg) {
  refuse("entry.png carries neither the PNG nor the JPEG signature");
}

// Dimensions. A PNG declares its size up front: after the 8-byte signature
// comes the IHDR chunk — a 4-byte length, the letters "IHDR", then width
// and height as big-endian 32-bit integers at offsets 16 and 20. A JPEG
// hides its size in a Start Of Frame segment, so reading it means walking
// the marker segments: each opens with FF and a marker byte, most carry a
// two-byte length that includes itself, and a few (TEM, the restart
// markers, SOI, EOI) stand alone with no length at all. The first SOF0,
// SOF1 or SOF2 segment lays out precision (1 byte), height (2), width (2).
function jpegSize(data: Buffer): { width: number; height: number } | null {
  let at = 2; // the signature check already confirmed the SOI marker
  while (at + 3 < data.length) {
    if (data[at] !== 0xff) return null;
    const marker = data[at + 1]!;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      at += 2;
      continue;
    }
    const segmentLength = data.readUInt16BE(at + 2);
    if (segmentLength < 2) return null;
    if (marker >= 0xc0 && marker <= 0xc2) {
      if (at + 9 > data.length) return null;
      return { height: data.readUInt16BE(at + 5), width: data.readUInt16BE(at + 7) };
    }
    at += 2 + segmentLength;
  }
  return null;
}

let sizeNote = "unmeasured";
if (looksPng) {
  if (picture.length < 24 || picture.toString("ascii", 12, 16) !== "IHDR") {
    refuse("entry.png has a PNG signature but no readable IHDR chunk");
  }
  const width = picture.readUInt32BE(16);
  const height = picture.readUInt32BE(20);
  if (width === 0 || height === 0) refuse(`PNG size reads as ${width}x${height}`);
  if (width > SIDE_LIMIT || height > SIDE_LIMIT) {
    refuse(`PNG is ${width}x${height}, over the ${SIDE_LIMIT}x${SIDE_LIMIT} limit`);
  }
  sizeNote = `${width}x${height}`;
} else {
  const size = jpegSize(picture);
  if (size === null) refuse("entry.png has a JPEG signature but no readable frame segment");
  if (size.width > SIDE_LIMIT || size.height > SIDE_LIMIT) {
    refuse(`JPEG is ${size.width}x${size.height}, over the ${SIDE_LIMIT}x${SIDE_LIMIT} limit`);
  }
  sizeNote = `${size.width}x${size.height}`;
}

// Everything checks out: deliver the picture.
mkdirSync(outDir, { recursive: true });
copyFileSync(picturePath, destination);

console.log(
  `the-day-in-one-picture-24: ${looksPng ? "PNG" : "JPEG"}, ${picture.length} bytes, ` +
    `${sizeNote} -> ${destination}`,
);
