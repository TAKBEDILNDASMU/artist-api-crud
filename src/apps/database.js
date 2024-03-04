import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const query = async (query, params) => {
  const connection = mysql
    .createConnection({
      host: process.env.HOSTNAME,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      connectTimeout: 60000,
      multipleStatements: true,
    })
    .promise();

  const [rows] = await connection.query(query, params);

  connection.end();

  return rows;
};

export default {
  query,
};
