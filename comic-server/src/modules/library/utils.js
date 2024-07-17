const fs = require('fs');
const { query } = require("../../lib/mysql");
const { handleComicZipFile } = require('../../utils/zipUtils');
const config = require('config');

const { coverDir } = config.get('app');

if (!fs.existsSync(coverDir)) {
  fs.mkdirSync(coverDir);
}

// return KB of file
const getFileSize = (file) => {
  const stat = fs.statSync(file);
  return Math.floor(stat.size / 1024);
};

const updateComics = async (comics) => {
  const covers = [];
  for (const { id, filePath } of comics) {
    const handleResult = handleComicZipFile(filePath, coverDir, id);
    if (!handleResult) {
      // TODO add scan error log
    } else {
      const { coverPath, pageCount } = handleResult;
      await query('UPDATE comic SET cover = ?, page_count = ? WHERE id = ?', [coverPath, pageCount, id]);
      covers.push(coverPath);
    }
  }
  return covers;
};

const scanLibrary = async (libraryId) => {
  const comics = await query('SELECT id, file_path AS filePath FROM comic WHERE library_id = ?', [libraryId]);
  const covers = await updateComics(comics);
  if (covers.length) {
    await query('UPDATE library SET cover = ? WHERE id = ?', [covers[0], libraryId]);
  }
  console.log('scan finished');
};

const refreshLibrary = async (libraryId) => {
  const comics = await query('SELECT id, file_path AS filePath FROM comic WHERE library_id = ? AND cover IS NULL', [libraryId]);
  await updateComics(comics);
  console.log('refresh finished');
};

module.exports = { getFileSize, scanLibrary, refreshLibrary };
