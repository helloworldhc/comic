const fs = require('fs');
const path = require('path');
const { ServerError, errorCode } = require('../../utils/serverError');

module.exports = class FileSystemApi {
  static async getChildDirs(dir) {
    if (!fs.existsSync(dir)) {
      throw new ServerError(errorCode.System_Path_Not_Exist);
    }
    const contents = fs.readdirSync(dir);
    const dirs = [];
    for (const c of contents) {
      const stat = fs.statSync(path.join(dir, c));
      if (stat.isDirectory()) {
        dirs.push(c);
      }
    }
    return { dirs };
  }
};
