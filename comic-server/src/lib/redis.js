const Redis = require('ioredis');
const config = require('config');

const redis = new Redis(config.get('redis'));

module.exports = redis;
