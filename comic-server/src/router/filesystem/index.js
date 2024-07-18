const Router = require('@koa/router');
const validate = require('../../middleware/validate');
const joi = require('joi');
const FileSystemApi = require('../../modules/filesystem');
const router = new Router();

/**
 * @apiDefine FileSystem 文件系统
 */

/**
 * @api {get} /filesystem 获取文件系统
 * @apiGroup FileSystem
 * @apiQuery {string} dir 文件夹
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "dirs":[{
 *      "name":"x"
 *    }]
 * }
 */
router.get('/',
  validate({
    query: {
      dir: joi.string().required()
    }
  }),
  async (ctx) => {
    ctx.body = await FileSystemApi.getChildDirs(ctx.query.dir);
  });

module.exports = router;
