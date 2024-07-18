const Router = require('@koa/router');
const validate = require('../../middleware/validate');
const joi = require('joi');
const router = new Router();

/**
 * @apiDefine Collection 收藏
 */

/**
 * @api {get} /collections 获取收藏列表
 * @apiGroup Collection
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "collections":[{
 *      "id":1,
 *      "name":"x",
 *      "cover":"x"
 *    }]
 * }
 */
router.get('/',
  validate({
  }),
  async (ctx) => {
    ctx.body = {};
  });

/**
 * @api {post} /collections 创建收藏
 * @apiGroup Collection
 * @apiBody {string} name 收藏的名字
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "id":1
 * }
 */
router.post('/',
  validate({
  }),
  async (ctx) => {
    ctx.body = {};
  });

/**
 * @api {put} /collections/:id 修改收藏
 * @apiGroup Collection
 * @apiParam {number} id
 * @apiBody {string} name 收藏的名字
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * }
 */
router.put('/:id',
  validate({
  }),
  async (ctx) => {
    ctx.body = {};
  });

/**
 * @api {delete} /collections/:id 删除收藏
 * @apiGroup Collection
 * @apiParam {number} id
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * }
 */
router.delete('/:id',
  validate({
  }),
  async (ctx) => {
    ctx.body = {};
  });

/**
 * @api {post} /collections/:id/comics/:comicId 添加漫画到收藏
 * @apiGroup Collection
 * @apiParam {number} id
 * @apiParam {number} comicId
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * }
 */
router.post('/:id/comics/:comicId',
  validate({
  }),
  async (ctx) => {
    ctx.body = {};
  });

/**
 * @api {delete} /collections/:id/comics/:comicId 从收藏中移除漫画
 * @apiGroup Collection
 * @apiParam {number} id
 * @apiParam {number} comicId
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * }
 */
router.delete('/:id/comics/:comicId',
  validate({
  }),
  async (ctx) => {
    ctx.body = {};
  });

/**
 * @api {put} /collections/:id/comics/:comicId/seq 调整收藏中漫画的顺序
 * @apiGroup Collection
 * @apiParam {number} id
 * @apiParam {number} comicId
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * }
 */
router.put('/:id/comics/:comicId/seq',
  validate({
  }),
  async (ctx) => {
    ctx.body = {};
  });

module.exports = router;
