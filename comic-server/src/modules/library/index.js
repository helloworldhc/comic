const fs = require('fs');
const path = require('path');
const { transaction, query, queryOne } = require("../../lib/mysql");
const { ServerError, errorCode } = require('../../utils/serverError');
const { scanLibrary, getFileSize, refreshLibrary } = require('./utils');
const { getCoverUrl } = require('../../utils/staticFiles');

module.exports = class LibraryApi {
  static async getLibraries() {
    const libraries = await query(`
      SELECT id, name, cover, comic_count AS comicCount, last_visit_time AS lastVisitTime
      FROM library
      ORDER BY name`);
    return { libraries: libraries.map(v => Object.assign(v, { cover: getCoverUrl(v.cover) })) };
  }

  static async createLibrary(name, libraryPath) {
    if (!fs.existsSync(libraryPath)) {
      throw new ServerError(errorCode.Collection_Path_Not_Exist, 'path is not exists');
    }

    const currentFiles = fs.readdirSync(libraryPath);
    const newComics = [];
    let comicCount = 0;
    for (const file of currentFiles) {
      if (!file.endsWith('.zip')) {
        continue;
      }
      comicCount++;
      const filePath = path.join(libraryPath, file);
      const fileSize = getFileSize(filePath);
      newComics.push([filePath, fileSize, file.slice(0, file.length - 4)]);
    }

    const id = await transaction(async tQuery => {
      const libraries = await tQuery('SELECT 1 FROM library WHERE library_path = ?', [libraryPath]);
      if (libraries.length) {
        throw new ServerError(errorCode.Library_Path_Exist);
      }
      const result = await tQuery('INSERT INTO library(name, library_path, comic_count) VALUES(?)', [[name, libraryPath, comicCount]]);
      const libraryId = result.insertId;
      const comicData = newComics.map(v => [libraryId, ...v]);
      comicData.length && await tQuery(`INSERT INTO comic(library_id, file_path, file_size, file_name) VALUES ?`, [comicData]);
      return libraryId;
    });

    scanLibrary(id).catch(error => {
      console.error('scan error', error);
    });
    return { id, comicCount };
  }

  static async updateLibrary(id, name) {
    await query('UPDATE library SET name = ? WHERE id = ?', [name, id]);
    return {};
  }

  static async deleteLibrary(id) {
    const comicsToClean = await transaction(async tQuery => {
      const comics = await tQuery('SELECT cover FROM comic WHERE library_id = ? AND cover IS NOT NULL', [id]);
      await query(`
        DELETE a, b
        FROM library AS a
        LEFT JOIN comic AS b ON a.id = b.library_id
        WHERE a.id = ?`, [id]);
      await tQuery(`
          DELETE a, b
          FROM library AS a
          LEFT JOIN comic AS b ON a.id = b.library_id
          WHERE a.id = ?`, [id]);
      return comics;
    });
    for (const { cover } of comicsToClean) {
      fs.unlinkSync(cover);
    }
    return {};
  }

  static async refreshLibrary(id) {
    const [library, currentComics] = await Promise.all([
      queryOne('SELECT library_path AS libraryPath FROM library WHERE id = ?', [id]),
      query('SELECT id, file_path AS filePath, cover FROM comic WHERE library_id = ?', [id])
    ]);

    if (!library) {
      throw new ServerError(errorCode.Library_Not_Found);
    }
    const { libraryPath } = library;
    const dirContents = fs.readdirSync(libraryPath);
    const comicToAdd = [];
    let comicCount = 0;
    for (const file of dirContents) {
      if (!file.endsWith('.zip')) {
        continue;
      }
      comicCount++;
      const comicPath = path.join(libraryPath, file);
      const existIndex = currentComics.findIndex(v => v.filePath === comicPath);
      if (existIndex !== -1) {
        currentComics.splice(existIndex, 1);
      } else {
        const filePath = path.join(libraryPath, file);
        const fileSize = getFileSize(filePath);
        comicToAdd.push([id, filePath, fileSize, file.slice(0, file.length - 4)]);
      }
    }

    await transaction(async tQuery => {
      comicToAdd.length && await tQuery(`INSERT INTO comic(library_id, file_path, file_size, file_name) VALUES ?`, [comicToAdd]);
      currentComics.length && await tQuery(`DELETE FROM comic WHERE id IN (?)`, [currentComics.map(v => v.id)]);
      await tQuery('UPDATE library SET comic_count = ? WHERE id = ?', [comicCount, id]);
    });

    refreshLibrary(id).catch(error => {
      console.error('refresh error', error);
    });

    for (const { cover } of currentComics) {
      fs.unlinkSync(cover);
    }
    return {};
  }

  static async getLibraryContent(id, progress, orderBy, order, page, pageSize) {
    let baseSql = `
    FROM comic AS a
    LEFT JOIN reading_progress AS b ON a.id = b.comic_id
    WHERE a.library_id = ?`;
    if (progress !== undefined) {
      switch (progress) {
        case 1:
          baseSql += ' AND b.comic_id IS NULL';
          break;
        case 2:
          baseSql += ' AND (b.comic_id IS NOT NULL AND b.finished = 0)';
          break;
        case 3:
          baseSql += ' AND b.finished = 1';
          break;
        default:
          break;
      }
    }

    let orderStr = 'ORDER BY name';
    if (orderBy !== undefined) {
      orderStr = `ORDER BY ${orderBy} ${order === 1 ? 'ASC' : 'DESC'}`;
    }
    const [library, comics, count] = await Promise.all([
      queryOne(`
      SELECT id, name, cover, comic_count AS comicCount, library_path AS path, last_visit_time AS lastVisitTime
      FROM library
      WHERE id = ?`, [id]),
      query(`
      SELECT a.id, IFNULL(a.name, a.file_name) AS name, a.file_size AS size, a.cover, a.page_count AS pageCount, a.create_time AS createTime,
        IFNULL(b.page, 0) AS readingProgress, IFNULL(b.finished, 0) AS finished, b.last_time AS lastTime
      ${baseSql}
      ${orderStr} 
      LIMIT ?, ?`, [id, (page - 1) * pageSize, pageSize]),
      queryOne(`SELECT COUNT(*) AS comicCount ${baseSql}`, [id]),
    ]);
    return { ...library, cover: getCoverUrl(library.cover), comics: comics.map(v => Object.assign(v, { cover: getCoverUrl(v.cover) })), ...count };
  }
};
