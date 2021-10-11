import { MysqlServerQuery } from './MysqlServer.js';

export const getDynamicSql_Mysql = async (scaleNumb, detail_subt) => {
  return MysqlServerQuery(scaleNumb, detail_subt); 
};