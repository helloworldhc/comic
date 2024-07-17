const { ServerError, errorCode } = require("../utils/serverError");

module.exports = () => async (ctx, next) => {
  try {
    await next();
    if (ctx.request.path.search(/\/api\/comics\/\d+\/page\/\d+/) === -1) {
      ctx.body = {
        code: 0,
        msg: 'ok',
        data: ctx.body
      };
    }
  } catch (e) {
    let msg = '';
    if (e instanceof ServerError) {
      console.error(e)
      switch (e.code) {
        case errorCode.Params:
          msg = e.message;
          break;
        case errorCode.MySql:
          msg = 'database error';
          break;
        default:
          break;
      }
    } else {
      console.error(msg, e);
    }
    ctx.body = {
      code: e.code || -1,
      msg
    };
  }
};
