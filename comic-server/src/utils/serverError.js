class ServerError extends Error {
  constructor(code, msg) {
    super(msg);
    this.code = code;
  }
}

const errorCode = {
  MySql: 100,
  Params: 101,
  Library_Path_Exist: 1000,
  Library_Path_Not_Exist: 1001,
  Library_Not_Found: 1002,
  System_Path_Not_Exist: 1100
};

module.exports = { ServerError, errorCode };
