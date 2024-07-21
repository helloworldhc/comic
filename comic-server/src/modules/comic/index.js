const { queryOne, query, transaction } = require("../../lib/mysql");
const { getCoverUrl } = require("../../utils/staticFiles");
const { getImageBufferOfZip } = require("../../utils/zipUtils");

module.exports = class ComicApi {
  static async getComics(search) {
    const searchStr = `%${search}%`;
    const comics = await query(`
      SELECT a.id, IFNULL(a.name, a.file_name) AS name, a.file_size AS size, a.cover, a.page_count AS pageCount, a.create_time AS createTime,
        IFNULL(b.page, 0) AS readingProgress, IFNULL(b.finished, 0) AS finished, b.last_time AS lastTime,
        c.id AS libraryId, c.name AS libraryName
      FROM comic AS a
      LEFT JOIN reading_progress AS b ON a.id = b.comic_id
      JOIN library AS c ON a.library_id = c.id
      WHERE name LIKE ?
      ORDER BY name`, [searchStr]);
    return { comics: comics.map(v => ({ ...v, cover: getCoverUrl(v.cover) })) };
  }

  static async getComic(id) {
    const [comic, properties] = await Promise.all([
      queryOne(`
        SELECT a.id, IFNULL(a.name, a.file_name) AS name, a.file_size AS size, a.cover, IFNULL(a.authors, JSON_ARRAY()) AS authors,
          a.page_count AS pageCount, a.create_time AS createTime,
          IFNULL(b.page, 0) AS readingProgress, IFNULL(b.finished, 0) AS finished, b.last_time AS lastTime,
          c.id AS libraryId, c.name AS libraryName
        FROM comic AS a
        LEFT JOIN reading_progress AS b ON a.id = b.comic_id
        JOIN library AS c ON a.library_id = c.id
        WHERE a.id = ?`, [id]),
      query(`
        SELECT b.name, b.value
        FROM comic_property AS a
        JOIN property AS b ON a.property_id = b.id
        WHERE a.comic_id = ?`, [id])
    ]);
    Object.assign(comic, {
      cover: getCoverUrl(comic.cover),
      properties: [...properties.reduce((a, c) => {
        const { name, value } = c;
        if (a.has(name)) {
          a.get(name).values.push(value);
        } else {
          a.set(name, { name, values: [value] });
        }
        return a;
      }, new Map()).values()]
    });
    return comic;
  }

  static async editComic(id, name, authors, properties) {
    await transaction(async tQuery => {
      await tQuery('UPDATE comic SET name = ?, authors = ? WHERE id = ?', [name, JSON.stringify(authors), id]);
      const comicPropertyData = [];
      for (const { name, values } of properties) {
        for (const value of values) {
          const exists = await tQuery('SELECT id FROM property WHERE name = ? AND value = ?', [name, value]);
          let propertyId;
          if (exists.length) {
            propertyId = exists[0].id;
          } else {
            const result = await tQuery('INSERT INTO property(name, value) VALUES(?)', [[name, value]]);
            propertyId = result.insertId;
          }
          comicPropertyData.push([id, propertyId]);
        }
      }
      await tQuery('DELETE FROM comic_property WHERE comic_id = ?', [id]);
      comicPropertyData.length && await tQuery(`
        INSERT INTO comic_property(comic_id, property_id)
        VALUES ?`, [comicPropertyData]);
    });
    return {};
  }

  static async getComicProgress(id) {
    const comic = await queryOne(`
      SELECT a.id, IFNULL(a.name, a.file_name) AS name, a.page_count AS pageCount, 
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
