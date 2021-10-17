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
    ` SELECT *                                                                   ` +
    `   FROM (SELECT SCALENUMB                                                   ` +
    `               ,ROWNUM     AS rowno                                         ` +
    `               ,TO_CHAR(REC_FR_DTTM, 'YYYY-MM-DD HH24:MI:SS') REC_FR_DTTM   ` +
    `               ,TO_CHAR(REC_TO_DTTM, 'YYYY-MM-DD HH24:MI:SS') REC_TO_DTTM   ` +
    `               ,CAMERA_GUID                                                 ` +
    `               ,CAMERA_NAME                                                 ` +
    `           FROM ZM_IMS_VIDEO                                                ` +
    `          WHERE SCALENUMB = '${param.scaleNumb}'                                ` +
    `            AND last_yn   = 'Y')` +
    `  WHERE rowno = ${param.seq}` ;
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
    ` ,CAMERA_NUMBER` +
    ` ,REC_YN` +
    ` ,USE_YN     ` +
    ` ,MILESTONE_GUID     ` +
    ` ,MILESTONE_NAME     ` +
    `)VALUES      ` +
    ` ('${param.AREA_TP}'` +
    ` ,'${param.CAMERA_IP}'` +
    ` ,'${param.CAMERA_NAM}'` +
    ` ,'${param.RTSP_ADDR}'` +
    ` ,${param.SEQ}` +
    ` ,${param.CAMERA_PORT}` +
    ` ,${param.CAMERA_NUMBER}` +
    ` ,'${param.REC_YN}'` +
    ` ,'${param.USE_YN}'` +
    ` ,'${param.MILESTONE_GUID}'` +
    ` ,'${param.MILESTONE_NAME}')`;
  }else if(fn === 'ZM_IMS_CAMERA_UPDATE'){
    query = 
    ` UPDATE ZM_IMS_CAMERA      ` +
    `    SET USE_YN   = '${param.USE_YN}'` +
    `       ,REC_YN   = '${param.REC_YN}'` +
    `       ,CAMERA_NUMBER = ${param.CAMERA_NUMBER}` +
    `       ,SEQ      = ${param.SEQ}` +
    `  WHERE CAMERA_IP = '${param.CAMERA_IP}'` ;
  }else if(fn === 'ZM_IMS_CAMERA_UPDATE2'){
    query = 
    ` UPDATE ZM_IMS_CAMERA      ` +
    `    SET SEQ      = ${param.SEQ}` +
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
  }else if(fn === 'LOGIN_SESSION'){
    query = 
    ` SELECT a.USER_ID, ` +
    `        a.USER_NAM, ` +
    `        a.DEPT_NAM, ` +
    `        a.ERP_ID, ` +
    `        a.AREA_TP, ` +
    `        b.COMM_DTL_CD AS camera_no ` +
    `   FROM zm_ims_user a ` +
    `        LEFT JOIN zm_ims_code b  ON b.comm_cd = a.area_tp ` +
    `                                AND b.use_yn  = 'Y' ` +
    `                                AND b.comm_dtl_cd != '*' ` +
    `   WHERE a.USER_ID = '${param.user_id}'  `;
  }else if(fn === 'MENU_1'){
    query = 
    ` SELECT * ` +
    `   FROM zm_ims_code ` +
    `  WHERE comm_cd = '1' ` +
    `    AND use_yn  = 'Y' ` +
    `    AND comm_dtl_cd != '*' `;
  }else if(fn === 'MENU_2'){
    query = 
    ` SELECT *                 ` +
    `   FROM zm_ims_menu       ` +
    `  WHERE menu_grp = '${param.menu_grp}' ` +
    `    AND use_yn = 'Y'      ` +
    `  ORDER BY menu_seq       ` ;
  }else if(fn === 'MENU_AUTH'){
    query = 
    ` SELECT * ` +
    `   FROM zm_ims_menu ` +
    `  WHERE menu_id = '${param.programId}'` ;
  }else if(fn === 'EMM_INSPECT_MOBILEY'){
    query = 
    ` CALL EMM_INSPECT_MOBILE ( ` +
    `  '${param.strScaleNumb}',     ` +
    `  '${param.strScrapAreaCode}',     ` +
    `  '${param.strOutageReasonCode}',     ` +
    `  '${param.strOutageWeightCode}',     ` +
    `  '${param.strReturnDivisionCode}',     ` +
    `  '${param.strReturnHistoryCode}',     ` +
    `  '${param.strOutageReasonEtcEdit}',     ` +
    `  '${param.strScrapGradeCode}',     ` +
    `  '${param.strScrapGradeItemCode}',     ` +
    `  '${param.strTallyHistoryCode}',     ` +
    `  '${param.strErpId}',     ` +
    `  '${param.strWorker}',     ` +
    `  '${param.strTallyRatio}',     ` +
    `  '${param.strCarType}',     ` +
    `  '${param.strWarning}',     ` +
    `  '${param.strRain}'      ` +
    ` )                          ` ;

    console.log(query);
  }else if(fn === 'AUTH_TOTAL'){
    query =
    ` SELECT MENU_ID                                                        ` +
    `       ,MAX(PGMAUT_YN) AS PGMAUT_YN                                    ` +
    `       ,MAX(RETAUT_YN) AS RETAUT_YN                                    ` +
    `       ,MAX(INSAUT_YN) AS INSAUT_YN                                    ` +
    `       ,MAX(SAVAUT_YN) AS SAVAUT_YN                                    ` +
    `       ,MAX(DELAUT_YN) AS DELAUT_YN                                    ` +
    `       ,MAX(PTZAUT_YN) AS PTZAUT_YN                                    ` +
    `   FROM (                                                              ` +
    `         SELECT b.MENU_ID                                              ` +
    `               ,b.PGMAUT_YN                                            ` +
    `               ,b.RETAUT_YN                                            ` +
    `               ,b.INSAUT_YN                                            ` +
    `               ,b.SAVAUT_YN                                            ` +
    `               ,b.DELAUT_YN                                            ` +
    `               ,b.PTZAUT_YN                                            ` +
    `           FROM zm_ims_user a                                          ` +
    `                INNER JOIN zm_ims_auth b  ON b.cop_cd = a.cop_cd       ` +
    `                                         AND b.cd_gbn = 'I'            ` +
    `                                         AND b.grp_user_id = a.user_id ` +
    `         WHERE a.cop_cd = '${param.COP_CD}'                            ` +
    `         AND a.user_id = '${param.user_id}'                            ` +
    
    `         UNION ALL                                                     ` +
               
    `         SELECT b.MENU_ID                                              ` +
    `               ,b.PGMAUT_YN                                            ` +
    `               ,b.RETAUT_YN                                            ` +
    `               ,b.INSAUT_YN                                            ` +
    `               ,b.SAVAUT_YN                                            ` +
    `               ,b.DELAUT_YN                                            ` +
    `               ,b.PTZAUT_YN                                            ` +
    `         FROM zm_ims_user a                                            ` +
    `            INNER JOIN zm_ims_auth b  ON b.cop_cd = a.cop_cd           ` +
    `                                     AND b.cd_gbn = 'G'                ` +
    `                                     AND b.grp_user_id = a.aut_tp      ` +
    `         WHERE a.cop_cd = '${param.COP_CD}'                            ` +
    `         AND a.user_id = '${param.user_id}')                           ` +
    `   GROUP                                                               ` +
    `      BY MENU_ID                                                       ` ;
  }else if(fn === 'DAILY_PROC_MAIN'){
    query = 
    ` SELECT H.DELIVERY_ID as scaleNumb` +
    `       ,PV.VENDOR_NAME ` +
    `       ,SC.REAL_VENDER_NAME ` +
    `       ,H.ATTRIBUTE3    ` +
    `       ,H.MOBILE_INSPECT_USER   ` +
    `       ,H.VEHICLE_NO ` +
    `       ,H.CAR_TYPE ` +
    `       ,EMM.TAKE_WGT ` +
    `       ,EMM.EMPTY_WGT ` +
    `       ,EMM.REAL_WGT ` +
    `       ,(H.REDUCE_WGT * L.IRON_RATE / 100) REDUCE_WGT    ` +
    `       ,H.NET_WEIGHT  ` +
    `       ,L.IRON_GRADE ` +
    `       ,DD.KORFNM AS PRE_IRON_GRADE_NAME ` +
    `       ,D.KORFNM AS IRON_GRADE_NAME` + 
    `       ,L.DISCOUNT_AMOUNT` +
    `       ,L.IRON_RATE ` +
    `       ,L.IRON_GRADE_ITEM ` +
    `       ,C.KORFNM AS IRON_GRADE_ITEM_NAME ` +
    
    `       ,SC.LOAD_AREA_ADDR ` +
    
    `       ,H.RETURN_GUBUN ` +
    `       ,F.KORFNM AS RETURN_GUBUN_NAME ` +
    
    `       ,H.RETURN_CODE ` +
    `       ,G.KORFNM AS RETURN_CODE_NAME  ` +
    `       ,H.DELIVERY_DATE ` +
    `       ,L.ITEM_NO ` +
    `       ,H.SECTOR_CODE ` +
    `       ,SC.SCRP_ORD_NO ` +
    `       , TO_CHAR(L.CREATION_DATE,'YYYY-MM-DD HH24:MI:SS')  AS INSPECT_TIME ` +
    `  FROM  BOL_PO_SCRAP_IRON_DELIVERY H ` +
    `,      BOL_PO_SCRAP_LINE          L ` +
    `,      PO_VENDORS                 PV ` +
    `,      PO_IRON_CODE_LINE         C ` +
    `,      PO_IRON_CODE_LINE         D ` +
    `,      PO_IRON_CODE_LINE         E ` +
    `,      PO_IRON_CODE_LINE         F ` +
    `,      PO_IRON_CODE_LINE         G ` +
    `,      EMM_MEASUREMENT            EMM ` +
    `,      YKS_TR_TRANS_ORDER@YKSCRAP SC ` +
    `,      PO_IRON_CODE_LINE         DD ` +
    `WHERE  H.DELIVERY_ID = L.DELIVERY_ID ` +
    `AND    H.VENDOR_ID = PV.VENDOR_ID ` +
    `AND    H.DELIVERY_DATE BETWEEN to_date('${param.fr_dt}','YYYYMMDD') AND to_date('${param.to_dt}','YYYYMMDD') ` +
    `AND    H.VEHICLE_NO LIKE '%${param.car_no}%'  ` +
    `AND   PV.VENDOR_NAME LIKE '%${param.vendor}%' ` +
    
    `AND     NVL(H.ATTRIBUTE2,'N') = 'Y' ` +
    `AND    NVL(H.VEHICLE_WEIGHT, 0) <> 0 ` +
    
    `AND    C.CODETP = L.IRON_GRADE ` +
    `AND    C.CODEID = L.IRON_GRADE_ITEM ` +
    
    `AND    D.CODETP = 'P005' ` +
    `AND    D.CODEID = L.IRON_GRADE ` +
    
    `AND   E.CODETP = 'P150' ` +
    `AND   E.CODEID = H.AREA_CODE ` +
    
    `AND    H.RETURN_GUBUN = F.CODEID(+) ` +
    `AND   F.CODETP(+) = 'P110' ` +
    
    `AND    H.RETURN_CODE = G.CODEID(+) ` +
    `AND   G.CODETP(+) = 'P120' ` +
    
    
    `AND    H.DELIVERY_DATE = EMM.MEA_DATE ` +
    `AND    H.DELIVERY_ID   = TO_NUMBER(TO_CHAR(EMM.MEA_DATE,'YYYYMMDD')||LTRIM(TO_CHAR(EMM.MEA_SEQ,'0000'))) ` +
    `AND    EMM.ORDER_NO    = SC.SCRP_ORD_NO(+) ` +
    
    `AND    SC.SCRP_GRD_CD = DD.CODEID(+) ` +
    `AND    DD.CODETP(+)   = 'P005' ` +
    
    `ORDER BY H.DELIVERY_ID  ` ;
  }

  return query;
};

module.exports = Common; 

