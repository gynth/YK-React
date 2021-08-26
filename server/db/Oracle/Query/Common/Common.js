const Common = (fn, param) => {
  let query = '';

  if(fn === 'SYSDATE'){
    query = `SELECT SYSDATE FROM DUAL`;
  }else if(fn === 'ZM_IMS_REC_SELECT'){
    query = 
    ` SELECT SCALENUMB   ` +
    `       ,REC_FR_DTTM ` +
    `       ,CAMERA_GUID ` +
    `       ,REC_TO_DTTM ` +
    `       ,CAMERA_NAME ` +
    `   FROM ZM_IMS_REC      ` +
    `  WHERE SCALENUMB = '${param[0].scaleNumb}' `;
  }else if(fn === 'ZM_IMS_REC_INSERT'){
    query = 
    ` INSERT INTO ZM_IMS_REC              ` +
    ` (SCALENUMB                          ` +
    ` ,REC_FR_DTTM                        ` +
    ` ,REC_TO_DTTM                        ` +
    ` ,CAMERA_GUID                        ` +
    ` ,CAMERA_NAME                        ` +
    ` )                                   ` +
    ` VALUES                              ` +
    ` ('${param[0].scaleNumb}'            ` +
    ` ,SYSDATE                            ` +
    ` ,NULL                               ` +
    ` ,'${param[0].Guid}'                 ` +
    ` ,'${param[0].Name}')                ` ;
  }else if(fn === 'ZM_IMS_REC_UPDATE'){
    query = 
    ` UPDATE ZM_IMS_REC              ` +
    `    SET rec_to_dttm = TO_DATE('${param[0].rec_to_dttm}', 'YYYY-MM-DD HH24:MI:SS')` +
    `  WHERE scaleNumb   = '${param[0].scaleNumb}'`;
  }else if(fn === 'ZM_IMS_REC_MAKE'){
    query = 
    ` SELECT SCALENUMB   ` +
    `       ,REC_FR_DTTM ` +
    `       ,CAMERA_GUID ` +
    `       ,REC_TO_DTTM ` +
    `       ,CAMERA_NAME ` +
    `   FROM ZM_IMS_REC      ` +
    `  WHERE REC_TO_DTTM IS NOT NULL `;
  }else if(fn === 'ZM_IMS_REC_DELETE'){
    query = 
    ` DELETE FROM ZM_IMS_REC      ` +
    `  WHERE scaleNumb   = '${param[0].scaleNumb}'`;
  }

  return query;
};

module.exports = Common; 