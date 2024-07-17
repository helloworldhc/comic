const config = require('config');

const { coverDir, coverHost } = config.get('app');

const getCoverUrl = (cover) => {
  if (!cover) {
    return '';
  }
  return `${coverHost}${cover.slice(coverDir.length)}`;
};

module.exports = { getCoverUrl };
