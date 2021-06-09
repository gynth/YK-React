import { MysqlServerQuery, MysqlServerSP, MysqlServerTemp } from './MysqlServer.js';
import { gfg_getModyfiedRow, gfg_getRow } from '../../Method/Grid';
import { gfc_getAtt } from '../../Method/Comm';

export const getDynamicSql_Mysql = (file, fn, param) => {
  return MysqlServerQuery(file, fn, param);
};

export const getDynamicSql_Mysql_temp = (file, fn, param, query) => {
  return MysqlServerTemp('Query', file, fn, param, query);
};

export const getCallSP_Mysql = (param, gridInfo, mustValue, del) => {

  if(gridInfo === undefined){
    return MysqlServerSP(param, undefined, mustValue);
  }else{
    const modGrid = [];

    if(del){
      const selectRow = gfg_getRow(gridInfo[0].grid)
      if(selectRow === null){
        return new Promise((resolve, reject) => {
          resolve({
            data: ({
              result  : false,
              COL_NAM : '',
              MSG_CODE: 'SELECT',
              MSG_TEXT: '선택된건이 없습니다.'
            })
          });
        })
      }
  
      if(selectRow['phantom']){
        gridInfo[0].grid.removeRow(selectRow['rowKey'])
        
        return new Promise((resolve, reject) => {
          resolve({
            data: ({
              result  : false,
              COL_NAM : '',
              MSG_CODE: 'PHANTOM',
              MSG_TEXT: ''
            })
          });
        })
      }
  
      if(window.confirm(gfc_getAtt('선택된행을 삭제 하시겠습니까?')) === true){

        const obj = {
          SP: gridInfo[0].SP
        }

        const Keys = Object.keys(gridInfo[0]);
        obj['rowStatus'] = mustValue[0]['ROWSTATUS'] === undefined ? 'D' : mustValue[0]['ROWSTATUS'];
        obj['rowKey']  = selectRow.rowKey;
        
        for(let k = 0; k < Keys.length; k++){
          if(Keys[k] !== 'grid' && Keys[k] !== 'SP'){
            const key = Keys[k];
            const type = gridInfo[0][Keys[k]];
            
            let value = selectRow[Keys[k]];
            const must = mustValue[0][key];
            if(must !== undefined) value = must;
            
            if(value !== undefined && value !== null){
              if(type === 'VARCHAR'){
                value = `'${value}'`;
              }else if(type === 'DATE'){
                value = `'${value}'`;
              }else{
                value = `${value}`;
              }
            }else{
              value = null;
            }

            obj[key] = value;
          }
        }
        modGrid[modGrid.length] = obj;
      }
    }else{
      for(let i = 0; i < gridInfo.length; i++){
        
        const modEachGrid = gfg_getModyfiedRow(gridInfo[i].grid);
  
        for(let j = 0; j < modEachGrid.length; j++){
          const obj = {
            SP: gridInfo[i].SP
          }
  
          const Keys = Object.keys(gridInfo[i]);
          obj['rowStatus'] = mustValue[0]['ROWSTATUS'] === undefined ? modEachGrid[j].rowStatus : mustValue[0]['ROWSTATUS'];
          obj['rowKey']  = modEachGrid[j].rowKey;
          
          for(let k = 0; k < Keys.length; k++){
            if(Keys[k] !== 'grid' && Keys[k] !== 'SP'){
              const key = Keys[k];
              const type = gridInfo[i][Keys[k]];
              
              let value = modEachGrid[j][Keys[k]];
              const must = mustValue[0][key];
              if(must !== undefined) value = must;
              
              if(value !== undefined && value !== null){
                if(type === 'VARCHAR'){
                  value = `'${value}'`;
                }else if(type === 'DATE'){
                  value = `'${value}'`;
                }else{
                  value = `${value}`;
                }
              }else{
                value = null;
              }
  
              obj[key] = value;
            }
          }
          modGrid[modGrid.length] = obj;
        }
      }
    }
    
    return MysqlServerSP(param, modGrid);
  }

  // const queryList = [];
  
  // if(gridInfo === undefined){
    
  //   for(let i = 0; i < param.length; i++){
  //     const keys = Object.keys(param[0]);
      
  //     let query = `
  //     SET @p_SUCCESS  = false;
  //     SET @p_MSG_CODE = '';
  //     SET @p_MSG_TEXT = '';
  //     SET @p_COL_NAM  = '';CALL ${param[i].SP} ('${param[i].ROWSTATUS}'`;
  
  //     keys.forEach(e => {
  //       if(e !== 'SP' && e !== 'ROWSTATUS'){
  //         if(typeof(param[i][e]) === 'string')
  //           query += `,'${param[i][e]}' `
  //         else
  //         query += `,${param[i][e]} `
  //       }
  //     }) 

  //     query += ',@p_SUCCESS, @p_MSG_CODE, @p_MSG_TEXT, @p_COL_NAM); SELECT @p_SUCCESS, @p_MSG_CODE, @p_MSG_TEXT, @p_COL_NAM;';
  //     queryList[i] = query;
  //   }
    
  //   return MysqlServerSP(queryList);
  // }else{
  //   const queryList = [];

  //   for(let i = 0; i < gridInfo.length; i++){
  //     const modRows = gfg_getModyfiedRow(gridInfo[i].grid);

  //     for(let j = 0; j < modRows.length; j++){
  //       const Keys = Object.keys(gridInfo[i]);
        
  //       let query = `
  //       SET @p_SUCCESS  = false;
  //       SET @p_MSG_CODE = '';
  //       SET @p_MSG_TEXT = '';
  //       SET @p_COL_NAM  = '';
  //       CALL ${gridInfo[i].SP} ('${modRows[j].rowStatus}'`;

  //       for(let k = 0; k < Keys.length; k++){
  //         if(Keys[k] !== 'grid' && Keys[k] !== 'SP'){
  //           const key = Keys[k];
  //           const type = gridInfo[i][Keys[k]];
            
  //           let value = modRows[j][Keys[k]];
  //           const must = mustValue[0][key];
  //           if(must !== undefined) value = must;
            
  //           if(value !== undefined){
  //             if(type === 'VARCHAR')
  //               query += `,'${value}' `;
  //             else
  //               query += `,${value} `;
  //           }else{
  //             query += `,null `;
  //           }
  //         }
  //       }
        
  //       query += ',@p_SUCCESS, @p_MSG_CODE, @p_MSG_TEXT, @p_COL_NAM); SELECT @p_SUCCESS, @p_MSG_CODE, @p_MSG_TEXT, @p_COL_NAM;';
  //       queryList[i] = query;
  //     }
  //   }

  //   if(queryList.length === 0){
  //     return new Promise((resolve, reject) => {
  //       resolve({
  //         data: ({
  //           result  : false,
  //           MSG_CODE: 'NO MOD',
  //           MSG_TEXT: '추가되거나 수정된건이 없습니다.'
  //         })
  //       });
  //     })
  //   }else{

  //   }
  // }
}