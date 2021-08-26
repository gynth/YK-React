import { OracleServerQuery } from './OracleServer.js';

export const getDynamicSql_Oracle = async (file, fn, param) => {
  return OracleServerQuery(file, fn, param); 
};
