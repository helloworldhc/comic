const Router = require('@koa/router');
const validate = require('../../middleware/validate');
const joi = require('joi');
const ComicApi = require('../../modules/comic');
const router = new Router();

/**
 * @apiDefine Comic 漫画
 */

/**
 * @api {get} /comics 获取漫画
 * @apiGroup Comic
 * @apiParam {string} search 搜索内容
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "comics":[{
 *      "id":1,
 *      "name":"x",
 *      "size":1, // KB单位
 *      "cover":"x",
 *      "pageCount":1,
 *      "readingProgress":1, // 阅读进度，范围为1~pageCount
 *      "finished":1,
 *      "lastTime":"xx", // 上次观看时间
 *      "libraryId":1,
 *      "libraryName":"x"
 *    }],
 * }
 */
router.get('/',
  validate({
    query: {
      search: joi.string().required()
    }
  }),
  async (ctx) => {
    ctx.body = await ComicApi.getComics(ctx.query.search);
  });

/**
 * @api {get} /comics/:id 获取漫画信息
 * @apiGroup Comic
 * @apiParam {number} id 漫画id
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "id":1,
 *    "name":"x",
 *    "size":1, // KB单位
 *    "cover":"x",
 *    "filePath":"x"
 *    "pageCount":1,
 *    "readingProgress":1, // 阅读进度，范围为1~pageCount
 *    "finished":1,
 *    "lastTime":"xx", // 上次观看时间
 *    "libraryId":1,
 *    "libraryName":"x",
 *    "authors":["x"].
 *    "properties":[{
 *      "name":"xxx",
 *      "type":"string", // 类型为string或number
 *      "values":["x"], // type为number时为[1,2,3]
 *    }]
 * }
 */
router.get('/:id', async (ctx) => {
  ctx.body = await ComicApi.getComic(ctx.params.id);
});

/**
 * @api {put} /comics/:id 编辑漫画信息
 * @apiGroup Comic
 * @apiParam {number} id 漫画id
 * @apiBody {string} name
 * @apiBody {string[]} authors
 * @apiBody {object[]} properties 漫画属性，通过name, type, values可以定义自己需要的漫画信息
 * @apiBody {string} properties.name
 * @apiBody {string='string', 'number'} properties.type
 * @apiBody {array} properties.values
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * }
 */
router.put('/:id', async (ctx) => {
  ctx.body = {};
});

/**
 * @api {get} /comics/:id/progress 获取漫画阅读进度
 * @apiGroup Comic
 * @apiParam {number} id 漫画id
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "id":1,
 *    "name":"x",
 *    "pageCount":1,
 *    "readingProgress":1, // 阅读进度，范围为1~pageCount
 *    "libraryName":"x"
 * }
 */
router.get('/:id/progress', async (ctx) => {
  ctx.body = await ComicApi.getComicProgress(ctx.params.id);
});

/**
 * @api {put} /comics/:id/progress 更新阅读进度
 * @apiGroup Comic
 * @apiParam {number} id 漫画id
 * @apiBody {number} page
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *}
 */
router.put('/:id/progress',
  validate({
    body: {
      page: joi.number().required()
    }
  }),
  async (ctx) => {
    const { page } = ctx.request.body;
    ctx.body = await ComicApi.updateComicProgress(ctx.params.id, page);
  });

/**
 * @api {get} /comics/:id/page/:page 获取page页漫画
 * @apiGroup Comic
 * @apiParam {number} id 漫画id
 * @apiParam {number} page
 * @apiSuccessExample {image/jpeg} Success-Response:
 * HTTP/1.1 200 OK
 */
router.get('/:id/page/:page',
  validate({
    params: {
      id: joi.number().required(),
      page: joi.number().required(),
    }
  }),
  async (ctx) => {
    const { id, page } = ctx.params;
    const { buffer, mimeType } = await ComicApi.getComicPage(id, page);
    ctx.set('content-type', mimeType);
    ctx.body = buffer;
  });

module.exports = router;
