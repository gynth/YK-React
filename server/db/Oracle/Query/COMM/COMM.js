const COMM = (fn, param) => {
  let query = '';

  if(fn === 'ZM_IMS_CODE_SELECT_MAIN10'){
    query = 
    ` SELECT *  ` +
    `   FROM zm_ims_code ` +
    `  WHERE COMM_DTL_CD = '${param.COMM_DTL_CD}'`;
  }else if(fn === 'ZM_IMS_CODE_INSERT_MAIN10'){
    query = 
    ` INSERT INTO zm_ims_code ` +
    ` (cop_cd                 ` +
    ` ,comm_cd                ` +
    ` ,comm_nam               ` +
    ` ,comm_dtl_cd            ` +
    ` ,comm_dtl_nam           ` +
    ` ,sort_seq               ` +
    ` ,use_yn                 ` +
    ` ,crt_dt                 ` +
    ` ,crtchr_no              ` +
    ` ,upd_dt                 ` +
    ` ,updchr_no)             ` +
    ` values                  ` +
    ` ('${param.COP_CD}'      ` +
    ` ,'${param.COMM_CD}'     ` +
    ` ,'${param.COMM_NAM}'    ` +
    ` ,'${param.COMM_DTL_CD}' ` +
    ` ,'${param.COMM_DTL_CD}' ` +
    ` ,0                      ` +
    ` ,'${param.USE_YN}'      ` +
    ` , sysdate               ` +
    ` ,'${param.USER_ID}'     ` +
    ` , sysdate               ` +
    ` ,'${param.USER_ID}')    ` ;
  }else if(fn === 'ZM_IMS_CODE_UPDATE_MAIN10'){
    query = 
    ` UPDATE zm_ims_code ` +
    `    SET USE_YN    = '${param.USE_YN}'    ` +
    `       ,UPD_DT    = SYSDATE              ` +
    `       ,UPDCHR_NO = '${param.USER_ID}'   ` +
    `  WHERE COP_CD      = '${param.COP_CD}'  ` +
    `    AND COMM_CD     = '${param.COMM_CD}' ` +
    `    AND COMM_DTL_CD = '*'                `;
  }else if(fn === 'ZM_IMS_CODE_DELETE_MAIN10'){
    query = 
    ` DELETE FROM zm_ims_code ` +
    `  WHERE COP_CD      = '${param.COP_CD}'  ` +
    `    AND COMM_CD     = '${param.COMM_CD}' `;
  }else if(fn === 'ZM_IMS_CODE_SELECT_DETAIL10'){
    query = 
    ` SELECT *  ` +
    `   FROM zm_ims_code ` +
    `  WHERE COP_CD  = '${param.COP_CD}'          ` +
    `    AND COMM_CD = '${param.COMM_CD}'        ` + 
    `    AND COMM_DTL_CD != '*'                   ` +
    `  ORDER                                      ` +
    `     BY SORT_SEQ                             ` ;
  }else if(fn === 'ZM_IMS_CODE_INSERT_DETAIL10'){
    query = 
    ` INSERT INTO zm_ims_code ` +
    ` (cop_cd                 ` +
    ` ,comm_cd                ` +
    ` ,comm_nam               ` +
    ` ,comm_dtl_cd            ` +
    ` ,comm_dtl_nam           ` +
    ` ,sort_seq               ` +
    ` ,use_yn                 ` +
    ` ,crt_dt                 ` +
    ` ,crtchr_no              ` +
    ` ,upd_dt                 ` +
    ` ,updchr_no)             ` +
    ` values                  ` +
    ` ('${param.COP_CD}'      ` +
    ` ,'${param.COMM_CD}'     ` +
    ` ,'${param.COMM_NAM}'    ` +
    ` ,'${param.COMM_DTL_CD}' ` +
    ` ,'${param.COMM_DTL_NAM}'` +
    ` , ${param.SORT_SEQ}     ` +
    ` ,'${param.USE_YN}'      ` +
    ` , sysdate               ` +
    ` ,'${param.USER_ID}'     ` +
    ` , sysdate               ` +
    ` ,'${param.USER_ID}')    ` ;
  }else if(fn === 'ZM_IMS_CODE_UPDATE_DETAIL10'){
    query = 
    ` UPDATE zm_ims_code ` +
    `    SET SORT_SEQ  = ${param.SORT_SEQ}    ` +
    `       ,UPD_DT    = SYSDATE              ` +
    `       ,UPDCHR_NO = '${param.USER_ID}'   ` +
    `  WHERE COP_CD      = '${param.COP_CD}'  ` +
    `    AND COMM_CD     = '${param.COMM_CD}' ` +
    `    AND COMM_DTL_CD = '${param.COMM_DTL_CD}' `;
  }

  return query;
};

module.exports = COMM; 

