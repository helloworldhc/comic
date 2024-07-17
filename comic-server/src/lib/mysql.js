const mysql = require('mysql2/promise');
const config = require('config');
const { ServerError, errorCode } = require('../utils/serverError');

const mysqlConfig = config.get('mysql');
const pool = mysql.createPool(mysqlConfig);

const query = async (sql, params) => {
  let connection;
  try {
    connection = await pool.getConnection();
    if (process.env.NODE_ENV === 'dev') {
      console.log('sql', mysql.format(sql, params));
    }
    const [result] = await connection.query(sql, params);
    connection.release();
    return result;
  } catch (error) {
    if (connection) {
      connection.release();
    }

    console.error('mysql error', error);
    throw new ServerError(errorCode.MySql);
  }
};

const queryOne = async (sql, params) => {
  const result = await query(sql, params);
  return result[0];
};

const transaction = async (queries) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const queryFunc = async (sql, params) => {
      try {
        if (process.env.NODE_ENV === 'dev') {
          console.log('sql', mysql.format(sql, params));
        }
        const [result] = await connection.query(sql, params);
        return result;
      } catch (e) {
        throw e;
      }
    };

    const result = await queries(queryFunc);
    await connection.commit();
    return result;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    if (error instanceof ServerError) {
      throw error;
    } else {
      if (process.env.NODE_ENV === 'dev') {
        console.error('transaction error', error.message);
      }
      throw new ServerError(errorCode.MySql);
    }
  }
};

module.exports = { query, queryOne, transaction };
