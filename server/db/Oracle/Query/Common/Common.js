const Common = (fn, param) => {
  let query = '';

  if(fn === 'SYSDATE'){
    query = `SELECT SYSDATE FROM DUAL`;
  }else if(fn === 'ZM_IMS_REC_SELECT'){
    query = 
    ` SELECT SCALENUMB   ` +
    `       ,SEQ         ` +
    `       ,TO_CHAR(REC_FR_DTTM, 'YYYY-MM-DD HH24:MI:SS') REC_FR_DTTM ` +
    `       ,CAMERA_GUID ` +
    `       ,CAMERA_NAME ` +
    `   FROM ZM_IMS_REC      ` +
    `  WHERE SCALENUMB = '${param.scaleNumb}' `+
    `    AND SEQ       = '${param.seq}' `;
  }else if(fn === 'ZM_IMS_REC_INSERT'){
    query = 
    ` INSERT INTO ZM_IMS_REC              ` +
    ` (SCALENUMB                          ` +
    ` ,SEQ                                ` +
    ` ,REC_FR_DTTM                        ` +
    ` ,CAMERA_GUID                        ` +
    ` ,CAMERA_NAME                        ` +
    ` )                                   ` +
    ` VALUES                              ` +
    ` ('${param.scaleNumb}'            ` +
    ` ,${param.seq}                    ` +
    ` ,SYSDATE                            ` +
    ` ,'${param.Guid}'                 ` +
    ` ,'${param.Name}')                ` ;
  }else if(fn === 'ZM_IMS_VIDEO_SELECT'){
    query = 
    ` SELECT SCALENUMB   ` +
    `       ,SEQ         ` +
    `       ,TO_CHAR(REC_FR_DTTM, 'YYYY-MM-DD HH24:MI:SS') REC_FR_DTTM ` +
    `       ,TO_CHAR(REC_TO_DTTM, 'YYYY-MM-DD HH24:MI:SS') REC_TO_DTTM ` +
    `       ,CAMERA_GUID ` +
    `       ,CAMERA_NAME ` +
    `   FROM ZM_IMS_VIDEO      ` +
    `  WHERE SCALENUMB = '${param.scaleNumb}' `+
    `    AND SEQ       = '${param.seq}' `;
  }else if(fn === 'ZM_IMS_REC_UPDATE'){
    query = 
    ` UPDATE ZM_IMS_REC              ` +
    `    SET REC_TO_DTTM = SYSDATE, ` + 
    `        REC_YN = 'Y'            ` +
    `  WHERE scaleNumb = '${param.scaleNumb}'` +
    `    AND seq       = ${param.seq}`;
  }else if(fn === 'ZM_IMS_VIDEO_INSERT'){
    query = 
    ` INSERT INTO ZM_IMS_VIDEO            ` +
    ` (SCALENUMB                          ` +
    ` ,SEQ                                ` +
    ` ,REC_FR_DTTM                        ` +
    ` ,REC_TO_DTTM                        ` +
    ` ,CAMERA_IP                          ` +
    ` ,CAMERA_GUID                        ` +
    ` ,CAMERA_NAME                        ` +
    ` )                                   ` +
    ` VALUES                              ` +
    ` ('${param.scaleNumb}'            ` +
    ` ,${param.seq}                    ` +
    ` ,TO_DATE('${param.rec_fr_dttm}', 'YYYY-MM-DD HH24:MI:SS') ` +
    ` ,SYSDATE                            ` +
    ` ,'${param.camera_ip}'            ` +
    ` ,'${param.Guid}'                 ` +
    ` ,'${param.Name}')                ` ;
  }else if(fn === 'ZM_IMS_REC_MAKE'){
    query = 
    ` SELECT SCALENUMB   ` +
    `       ,SEQ         ` +
    `       ,REC_FR_DTTM ` +
    `       ,REC_TO_DTTM ` +
    `       ,CAMERA_GUID ` + 
    `       ,CAMERA_NAME ` +
    `   FROM ZM_IMS_REC      ` +
    `  WHERE REC_YN = 'Y' `;
  }else if(fn === 'ZM_IMS_REC_DELETE'){ 
    query = 
    ` DELETE FROM ZM_IMS_REC      ` +
    `  WHERE scaleNumb = '${param.scaleNumb}'` + 
    `    AND seq       = ${param.seq}` ;
  }else if(fn === 'ZM_IMS_CAMERA_SELECT'){
    query = 
    ` SELECT * FROM ZM_IMS_CAMERA ORDER BY SEQ     `;
  }else if(fn === 'ZM_IMS_CAMERA_INSERT'){
    query = 
    ` INSERT INTO ZM_IMS_CAMERA      ` +
    ` (AREA_TP    ` +
    ` ,CAMERA_IP  ` + 
    ` ,CAMERA_NAM ` + 
    ` ,RTSP_ADDR  ` +
    ` ,SEQ        ` +
    ` ,CAMERA_PORT` +
    ` ,USE_YN     ` +
    `)VALUES      ` +
    ` ('${param.AREA_TP}'` +
    ` ,'${param.CAMERA_IP}'` +
    ` ,'${param.CAMERA_NAM}'` +
    ` ,'${param.RTSP_ADDR}'` +
    ` ,${param.SEQ}` +
    ` ,${param.CAMERA_PORT}` +
    ` ,'${param.USE_YN}')`;
  }else if(fn === 'ZM_IMS_CAMERA_UPDATE'){
    query = 
    ` UPDATE ZM_IMS_CAMERA      ` +
    `    SET USE_YN   = '${param.USE_YN}'` +
    `       ,SEQ      = ${param.SEQ}` +
    `  WHERE CAMERA_IP = '${param.CAMERA_IP}'` ;
  }else if(fn === 'ZM_IMS_CAMERA_DELETE'){
    query = 
    ` DELETE FROM ZM_IMS_CAMERA      ` +
    `  WHERE CAMERA_IP = '${param.CAMERA_IP}'` ;
  }else if(fn === 'ZM_IMS_CAMERA_SELECT_EACH'){
    query = 
    ` SELECT * FROM ZM_IMS_CAMERA      ` +
    `  WHERE AREA_TP  = '${param.AREA_TP}' ` +
    `    AND USE_YN   = 'Y' ` +
    `  ORDER BY SEQ `;
  }else if(fn === 'INSP_CANC_REASON'){
    query = 
    ` SELECT C.CODEID,C.KORFNM ` +
    ` FROM PO_IRON_CODE_LINE C ` + 
    ` WHERE C.CODETP = 'P670'  ` ;
  }else if(fn === 'LOGIN'){
    query = 
    ` SELECT * ` +
    `   FROM zm_ims_user ` + 
    `  WHERE USER_ID = '${param.user_id}'  `+ 
    `    AND USER_PWD = '${param.pass_cd}'  ` ;
  }

  return query;
};

module.exports = Common; 

