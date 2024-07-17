const Koa = require('koa');
const config = require('config')
const bodyParser = require('koa-bodyparser');
const router = require('./router');
const request = require('./middleware/request');
const response = require('./middleware/response');

const { port } = config.get('app');

const app = new Koa();
app.use(bodyParser());
app.use(response());
app.use(request());
app.use(router.routes());

app.listen(port);
