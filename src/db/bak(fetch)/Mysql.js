import { MysqlServer } from './MysqlServer.js';

export function getDynamicSql_Mysql(file, fn, param){
  return MysqlServer('Query', file, fn, param);
};