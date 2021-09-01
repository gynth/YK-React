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
    `  WHERE SCALENUMB = '${param[0].scaleNumb}' `+
    `    AND SEQ       = '${param[0].seq}' `;
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
    ` ('${param[0].scaleNumb}'            ` +
    ` ,${param[0].seq}                    ` +
    ` ,SYSDATE                            ` +
    ` ,'${param[0].Guid}'                 ` +
    ` ,'${param[0].Name}')                ` ;
  }else if(fn === 'ZM_IMS_VIDEO_SELECT'){
    query = 
    ` SELECT SCALENUMB   ` +
    `       ,SEQ         ` +
    `       ,TO_CHAR(REC_FR_DTTM, 'YYYY-MM-DD HH24:MI:SS') REC_FR_DTTM ` +
    `       ,TO_CHAR(REC_TO_DTTM, 'YYYY-MM-DD HH24:MI:SS') REC_TO_DTTM ` +
    `       ,CAMERA_GUID ` +
    `       ,CAMERA_NAME ` +
    `   FROM ZM_IMS_VIDEO      ` +
    `  WHERE SCALENUMB = '${param[0].scaleNumb}' `+
    `    AND SEQ       = '${param[0].seq}' `;
  }else if(fn === 'ZM_IMS_REC_UPDATE'){
    query = 
    ` UPDATE ZM_IMS_REC              ` +
    `    SET REC_TO_DTTM = SYSDATE, ` + 
    `        REC_YN = 'Y'            ` +
    `  WHERE scaleNumb = '${param[0].scaleNumb}'` +
    `    AND seq       = ${param[0].seq}`;
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
    ` ('${param[0].scaleNumb}'            ` +
    ` ,${param[0].seq}                    ` +
    ` ,TO_DATE('${param[0].rec_fr_dttm}', 'YYYY-MM-DD HH24:MI:SS') ` +
    ` ,SYSDATE                            ` +
    ` ,'${param[0].camera_ip}'            ` +
    ` ,'${param[0].Guid}'                 ` +
    ` ,'${param[0].Name}')                ` ;
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
    `  WHERE scaleNumb = '${param[0].scaleNumb}'` + 
    `    AND seq       = ${param[0].seq}` ;
  }else if(fn === 'ZM_IMS_CAMERA_SELECT'){
    query = 
    ` SELECT * FROM ZM_IMS_CAMERA      `;
  }else if(fn === 'ZM_IMS_CAMERA_INSERT'){
    query = 
    ` INSERT INTO ZM_IMS_CAMERA      ` +
    ` (AREA_TP   ` +
    ` ,CAMERA_IP ` + 
    ` ,RTSP_URL  ` +
    ` ,RTSP_PORT ` +
    ` ,USE_YN    ` +
    `)VALUES     ` +
    ` ('${param[0].AREA_TP}'` +
    ` ,'${param[0].CAMERA_IP}'` +
    ` ,'${param[0].RTSP_URL}'` +
    ` ,${param[0].RTSP_PORT}` +
    ` ,'${param[0].USE_YN}')`;
  }else if(fn === 'ZM_IMS_CAMERA_UPDATE'){
    query = 
    ` UPDATE ZM_IMS_CAMERA      ` +
    `    SET AREA_TP  = '${param[0].AREA_TP}',` +
    `        USE_YN   = '${param[0].USE_YN}'` +
    `  WHERE CAMERA_IP = '${param[0].CAMERA_IP}'` ;
  }else if(fn === 'ZM_IMS_CAMERA_DELETE'){
    query = 
    ` DELETE FROM ZM_IMS_CAMERA      ` +
    `  WHERE CAMERA_IP = '${param[0].CAMERA_IP}'` ;
  }else if(fn === 'ZM_IMS_CAMERA_SELECT_EACH'){
    query = 
    ` SELECT * FROM ZM_IMS_CAMERA      ` +
    `  WHERE AREA_TP  = '${param[0].AREA_TP}' ` +
    `    AND USE_YN   = 'Y' `;
  }else if(fn === 'INSP_CANC_REASON')
    query = 
    ` SELECT C.CODEID,C.KORFNM ` +
    ` FROM PO_IRON_CODE_LINE C ` + 
    ` WHERE C.CODETP = 'P670'  ` ;
  return query;
};

module.exports = Common; 

