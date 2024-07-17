const joi = require('joi');
const { ServerError, errorCode } = require('../utils/serverError');

const validator = (o, schema) => {
  if (schema) {
    const { error, value } = joi.object(schema).validate(o, { allowUnknown: true });
    if (error) {
      throw new ServerError(errorCode.Params, error.message);
    }
    Object.assign(o, value);
  }
};

const validate = ({ headers, query, params, body }) => async (ctx, next) => {
  validator(ctx.headers, headers);
  validator(ctx.query, query);
  validator(ctx.params, params);
  validator(ctx.request.body, body);
  await next();
};

module.exports = validate;
