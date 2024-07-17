const Router = require('@koa/router');
const libraryRouter = require('./library');
const comicRouter = require('./comic');
const filesystemRouter = require('./filesystem');

const router = new Router({
  prefix: '/api'
});

router.use('/libraries', libraryRouter.routes(), libraryRouter.allowedMethods());
router.use('/comics', comicRouter.routes(), comicRouter.allowedMethods());
router.use('/filesystem', filesystemRouter.routes(), filesystemRouter.allowedMethods());

module.exports = router;
