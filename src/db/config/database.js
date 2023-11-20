import {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE
} from '../../libs/env.js';

/** @type {import('sequelize').Options} */
export default {
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  host: DB_HOST,
  port: +DB_PORT,
  dialect: 'postgres'
};
