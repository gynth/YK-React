const Common = (fn, param) => {
  let query = '';

  if(fn === 'pr_menu'){
    query = 
    ' SELECT *              ' +
    '   FROM zm_menu        ' +
    '  WHERE use_yn = \'1\' ' +
    '    AND menu_level = ' + param[0].menu_level;
  }else if(fn === 'ch_menu'){
    query =
    '  SELECT menu_id    AS id    ' +
    '        ,NULL       AS up_id ' +
    '        ,menu_nam   AS nam   ' +
    '        ,menu_level AS level ' +
    '        ,pgm_id     AS pgm   ' +
    '    FROM zm_menu a ' +
    '   WHERE a.UP_MENU_ID = \'' + param[0].pr_menu + '\' '+
    
    '  UNION ALL  ' +
    
    '  SELECT b.menu_id    AS id    ' +
    '        ,b.up_menu_id AS up_id ' +
    '        ,b.menu_nam   AS nam   ' +
    '        ,b.menu_level AS level ' +
    '        ,b.pgm_id     AS pgm   ' +
    '    FROM zm_menu a ' +
    '         INNER JOIN zm_menu b  ON b.UP_MENU_ID = a.MENU_ID ' +
    '   WHERE a.UP_MENU_ID = \'' + param[0].pr_menu + '\' '+
    '   ORDER ' +
    '      BY id ';
  }else if(fn === 'ch_menu2'){
    query =
    'SELECT DISTINCT ' +
    '       MENU_ID  ' +
    '      ,MENU_NAM ' +
    '  FROM (SELECT CASE WHEN b.PGM_ID IS NOT NULL THEN b.UP_MENU_ID ELSE b.MENU_ID END AS MENU_ID, ' +
    '               CASE WHEN b.PGM_ID IS NOT NULL THEN a.MENU_NAM ELSE b.MENU_NAM END AS MENU_NAM  ' +
    '          FROM zm_menu a ' +
    '               INNER JOIN zm_menu b  ON b.UP_MENU_ID = a.MENU_ID ' +
    ' WHERE a.use_yn     = \'1\'  ' +
    '   AND a.menu_level = \'0\'  ' +
    '   AND a.MENU_ID    = \'' + param[0].pr_menu + '\') a ';  
  }else if(fn === 'ch_menu3'){
    query =
    'SELECT * ' +
    '  FROM zm_menu ' +
    ' WHERE use_yn = \'1\' ' +
    '   AND up_MENU_ID = \'' + param[0].pr_menu + '\' ';  
  }else if(fn === 'fm_facchk_item_cd'){
    query =
    'SELECT CHK_CLS      ' +
    '      ,CHK_ITEM_CD  ' +
    '      ,CHK_ITEM_NAM ' +
    '      ,CHK_TM       ' +
    '      ,PRD_UNT_CD   ' +
    '  FROM fm_facchk_item_cd ';
  }else if(fn === 'pm_rout_cd'){
    query =
    'SELECT rout_cd    ' +
    '      ,rout_nam   ' +
    '  from pm_rout_cd ' ;
  }else if(fn === 'test'){
    query =
    'select    COP_CD ' +
    ' ,SML_NO ' +
    ' ,YMD ' +
    ' ,FAC_CD ' +
    ' ,SEQ_NO ' +
    ' ,ROUT_MID_CAT_CD ' +
    ' ,STR_TM ' +
    ' ,END_TM ' +
    ' ,TM ' +
    ' ,TM_SEQ ' +
    ' ,HOLD_YN ' +
    ' ,STR_DT ' +
    ' ,END_DT ' +
    ' ,CRT_DT ' +
    ' ,CRTCHR_NO ' +
    ' ,UPD_DT ' +
    ' ,UPDCHR_NO  ' +
    '  from pm_sml_fac_mh_det limit 100' ;  
  }else if(fn === '2CRM'){
    query =
    'select a.*, ' +
    '       FLOOR(1 + (RAND() * 3)) AS code1, ' +
    '       FLOOR(1 + (RAND() * 3)) AS code2 ' +
    '  from das_data a' +
    ' where otime >= \'2021-01-28 09:00:00\' '+
    '   and otime <= \'2021-01-28 09:02:00\' '+
    '   and name   = \'2CRM_NEW_S7CP_003.2CR_IBA_DB230_REAL8\' ';
    // '  limit ' + Math.floor(Math.random() * 10) + 1;
    // '  limit 3000';
  }else if(fn === 'commTest'){
    query =
    'SELECT \'1\'     AS code  ' +
    '      ,\'TEST1\' AS value ' +
    '      ,\'TEST11\' AS value1 ' +
    '  FROM dual               ' +
    ' UNION ALL                ' +
    'SELECT \'2\'     AS code  ' +
    '      ,\'TEST2\' AS value ' +
    '      ,\'TEST22\' AS value1 ' +
    '  FROM dual               ' +
    ' UNION ALL                ' +
    'SELECT \'3\'     AS code  ' +
    '      ,\'TEST3\' AS value ' +
    '      ,\'TEST33\' AS value1 ' +
    '  FROM dual             ' +
    ' UNION ALL                ' +
    'SELECT \'54\'     AS code  ' +
    '      ,\'TEST4\' AS value ' +
    '      ,\'TEST44\' AS value1 ' +
    '  FROM dual             ' ;
  }else if(fn === 'login'){
    query =
    'SELECT * ' +
    '  FROM zm_user ' +
    ' WHERE cop_cd = \'10\' '+
    '   AND user_id = \'' + param[0].user_id + '\' ' +
    '   AND pass_cd = \'' + param[0].pass_cd + '\' ' ;
  }else if(fn === 'user'){
    query =
    'SELECT a.USER_NAM               ' +
    '      ,a.USER_ID                ' +
    '      ,d.DEPT_NAM AS DEPT_NAM   ' +
    '      ,b.USER_NAM AS CRTCHR_NAM ' +
    '      ,a.CRT_DT                 ' +
    '      ,c.USER_NAM AS UPD_NAM    ' +
    '      ,a.UPD_DT                 ' +
    '      ,a.USER_CLS_CD            ' +
    '      ,a.SAP_CD                 ' +
    '  FROM zm_user a                  ' +
    '       LEFT JOIN zm_user b  ON  b.USER_ID = a.CRTCHR_NO ' +
     
    '       LEFT JOIN zm_user c  ON  c.USER_ID = a.UPDCHR_NO ' +
     
    '       LEFT JOIN zm_dept d  ON  d.DEPT_NO = a.DEPT_NO   ' + 
    ' WHERE a.USER_NAM LIKE \'%' + param[0].user_nam + '%\''   +
    '   AND a.USER_ID  LIKE \'%' + param[0].user_id +  '%\''   ;

  }else if(fn === 'comm'){
    query =
    'SELECT *       ' +
    '  FROM zm_code ' +
    ' WHERE major_id = \'' + param[0].major_id + '\' ' ;
  }else if(fn === 'sap_cd'){
    query =
    'SELECT * FROM zm_sap' ;
  }else if(fn === 'CHART'){
    query = 'SELECT DATE_FORMAT(OTIME, \'%H%i%s\') AS OTIME, ' +
            '       VALUE, ' +
            '       RAWVALUE' +
            '  FROM das_data ' +
            ' WHERE name = \'' + param[0].name + '\' ' +
            // ' WHERE name in (\'2CRM_NEW_S7CP_001.2CR_IBA_DB1030_REAL92\') ' +
            // '   AND value > 0 ' +
            ' LIMIT 10000   ' ;
  }else if(fn=== 'TEST_POP'){
    query =
    'SELECT a.DEPT_NO ' +
    '      ,a.DEPT_NAM ' +
    '  FROM zm_dept a '+
    'WHERE COP_CD = \'10\''+
    'AND DEPT_NAM LIKE \'%' + param[0].dept_nam + '%\'' +
    'AND DEPT_NO LIKE \'%' + param[0].dept_no + '%\'';    
  }else if(fn === 'use_yn'){
    query =
    'SELECT \'1\' AS USE_YN ' +
    '     , \'Y\' AS YN_STR ' +
    'FROM dual ' +
    'UNION all ' + 
    'SELECT \'0\' AS USE_YN ' +
    '     , \'N\' AS YN_STR ' +
    'FROM dual ';
  }




  return query;
};

module.exports = Common; 