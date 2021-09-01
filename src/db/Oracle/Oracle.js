import { OracleServerQuery, OracleServerSP_YN } from './OracleServer.js';

export const getDynamicSql_Oracle = async (file, fn, param) => {
  return OracleServerQuery(file, fn, param); 
};

export const getSp_Oracle_YK = async (param) => {
  return OracleServerSP_YN(param);
}
