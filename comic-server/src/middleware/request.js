module.exports = () => async (ctx, next) => {
  const { method, path } = ctx.request;
  const start = new Date().getTime();
  await next();
  const end = new Date().getTime();
  let response = '';
  if (method === 'POST') {
    response = `\n${JSON.stringify(ctx.body)}`;
  }
  console.log(`[${method}][${ctx.status}][${end - start}ms] ${path}${response}`);
};
