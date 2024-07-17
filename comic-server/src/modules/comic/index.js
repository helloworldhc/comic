const { queryOne, query } = require("../../lib/mysql");
const { getCoverUrl } = require("../../utils/staticFiles");
const { getImageBufferOfZip } = require("../../utils/zipUtils");

module.exports = class ComicApi {
  static async getComic(id) {
    const comic = await queryOne(`
      SELECT a.id, a.file_name AS name, a.file_size AS size, a.cover, a.page_count AS pageCount, a.create_time AS createTime,
        IFNULL(b.page, 0) AS readingProgress, IFNULL(b.finished, 0) AS finished, b.last_time AS lastTime,
        c.id AS libraryId, c.name AS libraryName
      FROM comic AS a
      LEFT JOIN reading_progress AS b ON a.id = b.comic_id
      JOIN library AS c ON a.library_id = c.id
      WHERE a.id = ?`, [id]);
    Object.assign(comic, { cover: getCoverUrl(comic.cover) });
    return comic;
  }

  static async getComicProgress(id) {
    const comic = await queryOne(`
      SELECT a.id, a.file_name AS name, a.page_count AS pageCount, 
        IFNULL(b.page, 0) AS readingProgress,
        c.id AS libraryId, c.name AS libraryName
      FROM comic AS a
      LEFT JOIN reading_progress AS b ON a.id = b.comic_id
      JOIN library AS c ON a.library_id = c.id
      WHERE a.id = ?`, [id]);
    return comic;
  }

  static async updateComicProgress(id, page) {
    const comic = await queryOne('SELECT page_count AS pageCount FROM comic WHERE id = ?', [id]);
    const finished = page === comic.pageCount ? 1 : 0;
    await query(`INSERT INTO reading_progress(comic_id, page, finished) VALUES (?)
      ON DUPLICATE KEY UPDATE page = VALUES(page), finished = VALUES(finished)`, [[id, page, finished]]);
    return {};
  }

  static async getComicPage(id, page) {
    const comic = await queryOne('SELECT file_path AS filePath FROM comic WHERE id = ?', [id]);
    return getImageBufferOfZip(id, comic.filePath, page);
  }
};
