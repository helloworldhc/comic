const Router = require('@koa/router');
const validate = require('../../middleware/validate');
const joi = require('joi');
const LibraryApi = require('../../modules/library');

const router = new Router();

/**
 * @apiDefine Library 漫画库
 */

/**
 * @api {get} /libraries 获取漫画库
 * @apiGroup Library
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "libraries":[{
 *      "id":1,
 *      "name":"x",
 *      "cover":"x",
 *      "lastVisitTime":"x",
 *      "comicCount":1
 *    }]
 * }
 */
router.get('/', async (ctx) => {
  ctx.body = ctx.body = await LibraryApi.getLibraries();
});

/**
 * @api {post} /libraries 创建漫画库
 * @apiGroup Library
 * @apiBody {string} name 名称
 * @apiBody {string} path 漫画库路径
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "id":1,
 *    "comicCount":1
 * }
 */
router.post('/',
  validate({
    body: {
      name: joi.string().required(),
      path: joi.string().required(),
    }
  }),
  async ctx => {
    const { name, path } = ctx.request.body;
    ctx.body = await LibraryApi.createLibrary(name, path);
  }
);

/**
 * @api {put} /libraries/:id 修改漫画库
 * @apiGroup Library
 * @apiParam {number} id 漫画库id
 * @apiBody {string} name 名称
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * }
 */
router.put('/:id',
  validate({
    body: {
      name: joi.string().required(),
    }
  }),
  async ctx => {
    const { name } = ctx.request.body;
    ctx.body = await LibraryApi.updateLibrary(ctx.params.id, name);
  }
);

/**
 * @api {delete} /libraries/:id 删除漫画库
 * @apiGroup Library
 * @apiParam {number} id 漫画库id
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * }
 */
router.delete('/:id',
  async ctx => {
    ctx.body = await LibraryApi.deleteLibrary(ctx.params.id);
  }
);

/**
 * @api {put} /libraries/:id/refresh 刷新漫画库
 * @apiGroup Library
 * @apiParam {number} id 漫画库id
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * }
 */
router.put('/:id/refresh',
  async ctx => {
    ctx.body = await LibraryApi.refreshLibrary(ctx.params.id);
  }
);

/**
 * @api {get} /libraries/:id 获取漫画库内容
 * @apiGroup Library
 * @apiParam {number} id 漫画库id
 * @apiQuery {number} [page=1]
 * @apiQuery {number} [pageSize=10]
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "id":1,
 *    "name":"x",
 *    "path":"x",
 *    "cover":"x",
 *    "comicCount":1,
 *    "lastVisitTime":"x",
 *    "comics":[{
 *      "id":1,
 *      "name":"x",
 *      "size":1, // KB单位
 *      "cover":"x",
 *      "pageCount":1,
 *      "createTime":"x",
 *      "readingProgress":1, // 阅读进度，范围为1~pageCount
 *      "finished":1,
 *      "lastTime":"xx", // 上次观看时间
 *    }],
 *    "comicCount":1
 * }
 */
router.get('/:id',
  validate({
    query: {
      page: joi.number().default(1),
      pageSize: joi.number().default(10)
    }
  }),
  async ctx => {
    const { page, pageSize } = ctx.query;
    ctx.body = await LibraryApi.getLibraryContent(ctx.params.id, page, pageSize);
  }
);

module.exports = router;
