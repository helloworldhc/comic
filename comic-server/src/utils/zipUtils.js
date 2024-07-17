const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const { supportTypes, mimeTypeMap } = require('./constant');
const redis = require('../lib/redis');

const handleComicZipFile = (filePath, dstDir, id) => {
  const zip = new AdmZip(filePath);
  const entries = zip.getEntries();
  if (entries.length === 0) {
    console.error('no entries found', filePath);
    return null;
  }

  let firstImage;
  let pageCount = 0;
  for (const entry of entries) {
    const extname = path.extname(entry.entryName);
    if (supportTypes.includes(extname)) {
      !firstImage && (firstImage = entry.entryName);
      pageCount++;
    }
  }

  if (!firstImage) {
    return null;
  }

  zip.extractEntryTo(firstImage, dstDir);
  const extname = path.extname(firstImage);
  const coverPath = path.join(dstDir, `${id}${extname}`);
  fs.renameSync(path.join(dstDir, firstImage), coverPath);
  return { coverPath, pageCount };
};

const getImageBufferOfZip = async (comicId, filePath, page) => {
  try {
    const comicKey = `comic-cache:${comicId}`;
    if (await redis.exists(comicKey)) {
      const buffer = await redis.hgetBuffer(comicKey, `${page}-file`);
      const mimeType = await redis.hget(comicKey, `${page}-type`);
      return { buffer, mimeType };
    }
    const zip = new AdmZip(filePath);
    let i = 1;
    let buffer;
    let mimeType;
    const valueMap = new Map();
    for (const entry of zip.getEntries()) {
      const imageType = path.extname(entry.entryName);
      if (!supportTypes.includes(imageType)) {
        continue
      }
      const file = zip.readFile(entry);
      const mime = mimeTypeMap.get(imageType);
      if (i === page) {
        buffer = file;
        mimeType = mime;
      }
      valueMap.set(`${i}-file`, file);
      valueMap.set(`${i}-type`, mime);
      i++;
    }

    await redis.hset(comicKey, valueMap);
    await redis.expire(comicKey, 1800);
    return { buffer, mimeType };
  } catch (error) {
    console.error('failed to get image buffer', error);
    return null;
  }
};

module.exports = { handleComicZipFile, getImageBufferOfZip };
