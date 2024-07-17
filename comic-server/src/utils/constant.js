const mimeTypeMap = new Map([
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.webp', 'image/webp']
]);

const supportTypes = [...mimeTypeMap.keys()];

module.exports = {mimeTypeMap, supportTypes};
