import { store, injectAsyncReducer } from '../Store/Store';
import { jsonMaxValue, jsonRtn } from '../JSON/jsonControl';

export const gfs_getStoreValue = (reducer, value) => {
  let rtnValue = undefined;

  const getState = store.getState();
  if(getState !== undefined){
    if(getState[reducer] !== undefined){
      if(value !== undefined)
        rtnValue = getState[reducer][value];
      else
        rtnValue = getState[reducer];
    }
  }

  return rtnValue;
}

export const gfs_dispatch = (reducer, type, values) => {
  store.dispatch({
    reducer,
    type,
    ...values
  }) 
}

export const gfs_WINDOWFRAME_REDUCER = () => {
  if(store.asyncReducers['WINDOWFRAME_REDUCER'] === undefined){
      
    const windowFrameReducer = (nowState, action) => {

      if(action.reducer !== 'WINDOWFRAME_REDUCER') {
        return {
          activeWindow: nowState === undefined ? [] : nowState.activeWindow,
          windowState : nowState === undefined ? [] : nowState.windowState
        };
      }

      if(action.type === 'SELECTWINDOW'){
        // 1. 스토어에서 선택된 프로그램의 JSON을 찾는다
        let selJson = jsonRtn(nowState.windowState, 'programId', action.activeWindow['programId']);
        let maxZindex = jsonMaxValue(nowState.windowState, 'windowZindex');
    
        let frontYn = (nowState.activeWindow['programId'] === action.activeWindow['programId']) ? true : false;
    
        return Object.assign({}, nowState, {
          activeWindow: action.activeWindow, 
          windowState : [...nowState.windowState.filter(e => e.programId !== action.activeWindow['programId']), 
                                                 {'programId'   : action.activeWindow['programId'], 
                                                  'programNam'  : action.activeWindow['programNam'],
                                                  'windowZindex': selJson === undefined ? maxZindex + 1 : (frontYn ? selJson[0]['windowZindex'] : maxZindex + 1), 
                                                  'beforeWidth' : selJson === undefined ? 700 : selJson[0]['beforeWidth'],
                                                  'beforeHeight': selJson === undefined ? 700 : selJson[0]['beforeHeight'],
                                                  'windowWidth' : selJson === undefined ? '100%' : selJson[0]['windowWidth'], 
                                                  'windowHeight': selJson === undefined ? '100%' : selJson[0]['windowHeight'],
                                                  'beforeX'     : selJson === undefined ? 0 : selJson[0]['beforeX'],
                                                  'beforeY'     : selJson === undefined ? 0 : selJson[0]['beforeY'],
                                                  'X'           : selJson === undefined ? 0 : selJson[0]['X'],
                                                  'Y'           : selJson === undefined ? 0 : selJson[0]['Y'],
                                                  'resizing'    : false,
                                                  'dragging'    : false,
                                                  'Retrieve'    : selJson === undefined ? null : selJson[0]['Retrieve'],
                                                  'Insert'      : selJson === undefined ? null : selJson[0]['Insert'],
                                                  'Delete'      : selJson === undefined ? null : selJson[0]['Delete'],
                                                  'Save'        : selJson === undefined ? null : selJson[0]['Save'],
                                                  'Init'        : selJson === undefined ? null : selJson[0]['Init'],
                                                  'DtlInsert'   : selJson === undefined ? null : selJson[0]['DtlInsert'],
                                                  'DtlDelete'   : selJson === undefined ? null : selJson[0]['DtlDelete']
                                                 }]
        })
      }else if(action.type === 'MINIMIZEWINDOW'){
        // 1. 스토어에서 선택된 프로그램의 JSON을 찾는다
        let selJson = jsonRtn(nowState.windowState, 'programId', action.activeWindow['programId']);
        let maxZindex = jsonMaxValue(nowState.windowState, 'windowZindex');
    
        let frontYn = (nowState.activeWindow['programId'] === action.activeWindow['programId']) ? true : false;
    
        return Object.assign({}, nowState, {
          activeWindow: action.activeWindow, 
          windowState : [...nowState.windowState.filter(e => e.programId !== action.activeWindow['programId']), 
                                                 {'programId'   : action.activeWindow['programId'], 
                                                  'programNam'  : action.activeWindow['programNam'],
                                                  'windowZindex': frontYn ? selJson[0]['windowZindex'] : maxZindex + 1, 
                                                  'beforeWidth' : selJson[0]['beforeWidth'],
                                                  'beforeHeight': selJson[0]['beforeHeight'],
                                                  'windowWidth' : selJson[0]['beforeWidth'], 
                                                  'windowHeight': selJson[0]['beforeHeight'],
                                                  'beforeX'     : selJson[0]['beforeX'],
                                                  'beforeY'     : selJson[0]['beforeY'],
                                                  'X'           : selJson[0]['beforeX'],
                                                  'Y'           : selJson[0]['beforeY'],
                                                  'resizing'    : false,
                                                  'dragging'    : false,
                                                  'Retrieve'    : selJson[0]['Retrieve'],
                                                  'Insert'      : selJson[0]['Insert'],
                                                  'Delete'      : selJson[0]['Delete'],
                                                  'Save'        : selJson[0]['Save'],
                                                  'Init'        : selJson[0]['Init'],
                                                  'DtlInsert'   : selJson[0]['DtlInsert'],
                                                  'DtlDelete'   : selJson[0]['DtlDelete']
                                                 }]
        })
      }else if(action.type === 'MAXIMIZEWINDOW'){
        // 1. 스토어에서 선택된 프로그램의 JSON을 찾는다
        let selJson = jsonRtn(nowState.windowState, 'programId', action.activeWindow['programId']);
        let maxZindex = jsonMaxValue(nowState.windowState, 'windowZindex');
    
        let frontYn = (nowState.activeWindow['programId'] === action.activeWindow['programId']) ? true : false;
    
        return Object.assign({}, nowState, {
          activeWindow: action.activeWindow, 
          windowState : [...nowState.windowState.filter(e => e.programId !== action.activeWindow['programId']), 
                                                 {'programId'   : action.activeWindow['programId'], 
                                                  'programNam'  : action.activeWindow['programNam'],
                                                  'windowZindex': frontYn ? selJson[0]['windowZindex'] : maxZindex + 1, 
                                                  'beforeWidth' : selJson[0]['windowWidth'],
                                                  'beforeHeight': selJson[0]['windowHeight'],
                                                  'windowWidth' : '100%', 
                                                  'windowHeight': '100%',
                                                  'beforeX'     : selJson[0]['beforeX'],
                                                  'beforeY'     : selJson[0]['beforeY'],
                                                  'X'           : 0,
                                                  'Y'           : 0,
                                                  'resizing'    : false,
                                                  'dragging'    : false,
                                                  'Retrieve'    : selJson[0]['Retrieve'],
                                                  'Insert'      : selJson[0]['Insert'],
                                                  'Delete'      : selJson[0]['Delete'],
                                                  'Save'        : selJson[0]['Save'],
                                                  'Init'        : selJson[0]['Init'],
                                                  'DtlInsert'   : selJson[0]['DtlInsert'],
                                                  'DtlDelete'   : selJson[0]['DtlDelete']
                                                 }]
        })
      }else if(action.type === 'RESIZEWINDOW'){
        // 1. 스토어에서 선택된 프로그램의 JSON을 찾는다
        let selJson = jsonRtn(nowState.windowState, 'programId', action.activeWindow['programId']);
        let maxZindex = jsonMaxValue(nowState.windowState, 'windowZindex');
    
        let frontYn = (nowState.activeWindow['programId'] === action.activeWindow['programId']) ? true : false;
    
        return Object.assign({}, nowState, {
          activeWindow: action.activeWindow, 
          windowState : [...nowState.windowState.filter(e => e.programId !== action.activeWindow['programId']), 
                                                 {'programId'   : action.activeWindow['programId'], 
                                                  'programNam'  : action.activeWindow['programNam'],
                                                  'windowZindex': frontYn ? selJson[0]['windowZindex'] : maxZindex + 1, 
                                                  'beforeWidth' : selJson[0]['windowWidth'] + action.width,
                                                  'beforeHeight': selJson[0]['windowHeight'] + action.height,
                                                  'windowWidth' : selJson[0]['windowWidth'] + action.width, 
                                                  'windowHeight': selJson[0]['windowHeight'] + action.height,
                                                  'beforeX'     : action.X,
                                                  'beforeY'     : action.Y,
                                                  'X'           : action.X,
                                                  'Y'           : action.Y,
                                                  'resizing'    : false,
                                                  'dragging'    : false,
                                                  'Retrieve'    : selJson[0]['Retrieve'],
                                                  'Insert'      : selJson[0]['Insert'],
                                                  'Delete'      : selJson[0]['Delete'],
                                                  'Save'        : selJson[0]['Save'],
                                                  'Init'        : selJson[0]['Init'],
                                                  'DtlInsert'   : selJson[0]['DtlInsert'],
                                                  'DtlDelete'   : selJson[0]['DtlDelete']
                                                 }]
        })
      }else if(action.type === 'DRAGWINDOW'){
        // 1. 스토어에서 선택된 프로그램의 JSON을 찾는다
        let selJson = jsonRtn(nowState.windowState, 'programId', action.activeWindow['programId']);
        let maxZindex = jsonMaxValue(nowState.windowState, 'windowZindex');
    
        let frontYn = (nowState.activeWindow['programId'] === action.activeWindow['programId']) ? true : false;
    
        return Object.assign({}, nowState, {
          activeWindow: action.activeWindow, 
          windowState : [...nowState.windowState.filter(e => e.programId !== action.activeWindow['programId']), 
                                                 {'programId'   : action.activeWindow['programId'], 
                                                  'programNam'  : action.activeWindow['programNam'],
                                                  'windowZindex': frontYn ? selJson[0]['windowZindex'] : maxZindex + 1, 
                                                  'beforeWidth' : selJson[0]['beforeWidth'],
                                                  'beforeHeight': selJson[0]['beforeHeight'],
                                                  'windowWidth' : selJson[0]['windowWidth'], 
                                                  'windowHeight': selJson[0]['windowHeight'],
                                                  'beforeX'     : action.X,
                                                  'beforeY'     : action.Y,
                                                  'X'           : action.X,
                                                  'Y'           : action.Y,
                                                  'resizing'    : false,
                                                  'dragging'    : false,
                                                  'Retrieve'    : selJson[0]['Retrieve'],
                                                  'Insert'      : selJson[0]['Insert'],
                                                  'Delete'      : selJson[0]['Delete'],
                                                  'Save'        : selJson[0]['Save'],
                                                  'Init'        : selJson[0]['Init'],
                                                  'DtlInsert'   : selJson[0]['DtlInsert'],
                                                  'DtlDelete'   : selJson[0]['DtlDelete']
                                                 }]
        })
      }else if(action.type === 'RESIZESTART'){
        // 1. 스토어에서 선택된 프로그램의 JSON을 찾는다
        let selJson = jsonRtn(nowState.windowState, 'programId', action.activeWindow['programId']);
        let maxZindex = jsonMaxValue(nowState.windowState, 'windowZindex');
    
        let frontYn = (nowState.activeWindow['programId'] === action.activeWindow['programId']) ? true : false;
    
        return Object.assign({}, nowState, {
          activeWindow: action.activeWindow, 
          windowState : [...nowState.windowState.filter(e => e.programId !== action.activeWindow['programId']), 
                                                 {'programId'   : action.activeWindow['programId'], 
                                                  'programNam'  : action.activeWindow['programNam'],
                                                  'windowZindex': frontYn ? selJson[0]['windowZindex'] : maxZindex + 1, 
                                                  'beforeWidth' : selJson[0]['beforeWidth'],
                                                  'beforeHeight': selJson[0]['beforeHeight'],
                                                  'windowWidth' : selJson[0]['windowWidth'], 
                                                  'windowHeight': selJson[0]['windowHeight'],
                                                  'beforeX'     : selJson[0]['beforeX'],
                                                  'beforeY'     : selJson[0]['beforeY'],
                                                  'X'           : selJson[0]['X'],
                                                  'Y'           : selJson[0]['Y'],
                                                  'resizing'    : true,
                                                  'dragging'    : false,
                                                  'Retrieve'    : selJson[0]['Retrieve'],
                                                  'Insert'      : selJson[0]['Insert'],
                                                  'Delete'      : selJson[0]['Delete'],
                                                  'Save'        : selJson[0]['Save'],
                                                  'Init'        : selJson[0]['Init'],
                                                  'DtlInsert'   : selJson[0]['DtlInsert'],
                                                  'DtlDelete'   : selJson[0]['DtlDelete']
                                                 }]
        })
      }else if(action.type === 'DRAGSTART'){
        // 1. 스토어에서 선택된 프로그램의 JSON을 찾는다
        let selJson = jsonRtn(nowState.windowState, 'programId', action.activeWindow['programId']);
        let maxZindex = jsonMaxValue(nowState.windowState, 'windowZindex');
    
        let frontYn = (nowState.activeWindow['programId'] === action.activeWindow['programId']) ? true : false;
    
        return Object.assign({}, nowState, {
          activeWindow: action.activeWindow, 
          windowState : [...nowState.windowState.filter(e => e.programId !== action.activeWindow['programId']), 
                                                 {'programId'   : action.activeWindow['programId'], 
                                                  'programNam'  : action.activeWindow['programNam'],
                                                  'windowZindex': frontYn ? selJson[0]['windowZindex'] : maxZindex + 1, 
                                                  'beforeWidth' : selJson[0]['beforeWidth'],
                                                  'beforeHeight': selJson[0]['beforeHeight'],
                                                  'windowWidth' : selJson[0]['windowWidth'], 
                                                  'windowHeight': selJson[0]['windowHeight'],
                                                  'beforeX'     : selJson[0]['beforeX'],
                                                  'beforeY'     : selJson[0]['beforeY'],
                                                  'X'           : selJson[0]['X'],
                                                  'Y'           : selJson[0]['Y'],
                                                  'resizing'    : false,
                                                  'dragging'    : true,
                                                  'Retrieve'    : selJson[0]['Retrieve'],
                                                  'Insert'      : selJson[0]['Insert'],
                                                  'Delete'      : selJson[0]['Delete'],
                                                  'Save'        : selJson[0]['Save'],
                                                  'Init'        : selJson[0]['Init'],
                                                  'DtlInsert'   : selJson[0]['DtlInsert'],
                                                  'DtlDelete'   : selJson[0]['DtlDelete']
                                                 }]
        })
      }else if(action.type === 'INITFUNCTION'){
        // 1. 스토어에서 선택된 프로그램의 JSON을 찾는다
        let selJson = jsonRtn(nowState.windowState, 'programId', action.activeWindow['programId']);
    
        return Object.assign({}, nowState, {
          activeWindow: action.activeWindow, 
          windowState : [...nowState.windowState.filter(e => e.programId !== action.activeWindow['programId']), 
                                                 {'programId'   : action.activeWindow['programId'], 
                                                  'programNam'  : action.activeWindow['programNam'],
                                                  'windowZindex': selJson[0]['windowZindex'],
                                                  'beforeWidth' : selJson[0]['beforeWidth'],
                                                  'beforeHeight': selJson[0]['beforeHeight'],
                                                  'windowWidth' : selJson[0]['windowWidth'], 
                                                  'windowHeight': selJson[0]['windowHeight'],
                                                  'beforeX'     : selJson[0]['beforeX'],
                                                  'beforeY'     : selJson[0]['beforeY'],
                                                  'X'           : selJson[0]['X'],
                                                  'Y'           : selJson[0]['Y'],
                                                  'resizing'    : selJson[0]['resizing'],
                                                  'dragging'    : selJson[0]['dragging'],
                                                  'Retrieve'    : action.activeWindow['Retrieve'],
                                                  'Insert'      : action.activeWindow['Insert'],
                                                  'Delete'      : action.activeWindow['Delete'],
                                                  'Save'        : action.activeWindow['Save'],
                                                  'Init'        : action.activeWindow['Init'],
                                                  'DtlInsert'   : action.activeWindow['DtlInsert'],
                                                  'DtlDelete'   : action.activeWindow['DtlDelete']
                                                 }]
        })
      }else if(action.type === 'CLOSEWINDOW'){
    
        return Object.assign({}, nowState, {
          activeWindow: [], 
          windowState : [...nowState.windowState.filter(e => e.programId !== action.activeWindow['programId'])]
        })
      }
    };
    gfs_injectAsyncReducer('WINDOWFRAME_REDUCER', windowFrameReducer);
  }
}

export const gfs_injectAsyncReducer = (name, asyncReducer) => {
  injectAsyncReducer(name, asyncReducer);
}

export const gfs_PGM_REDUCER = (pgm) => {
  if(store.asyncReducers[pgm] === undefined){
      
    const programReducer = (nowState, action) => {

      if(action.reducer !== pgm) {
        return {
          Grid    : nowState === undefined ? [] : nowState.Grid,
          Input   : nowState === undefined ? [] : nowState.Input,
          Combo   : nowState === undefined ? [] : nowState.Combo,
          DateTime: nowState === undefined ? [] : nowState.DateTime,
          Number  : nowState === undefined ? [] : nowState.Number
        };
      }

      if(action.type === 'INITGRID'){

        return Object.assign({}, nowState, {
          Grid : [...nowState.Grid, action.Grid]
        })
      }else if(action.type === 'INITINPUT'){

        return Object.assign({}, nowState, {
          Input: [...nowState.Input, action.Input]
        })
      }else if(action.type === 'INITCOMBO'){

        return Object.assign({}, nowState, {
          Combo: [...nowState.Combo, action.Combo]
        })
      }else if(action.type === 'INITDATETIME'){

        return Object.assign({}, nowState, {
          DateTime: [...nowState.DateTime, action.DateTime]
        })
      }else if(action.type === 'INITNUMBER'){

        return Object.assign({}, nowState, {
          Number: [...nowState.Number, action.Number]
        })
      }else if(action.type === 'DELPGM'){

        return Object.assign({}, nowState, {
          Grid    : [],
          Input   : [],
          Combo   : [],
          DateTime: [],
          Number  : []
        })
      }
    }
    gfs_injectAsyncReducer(pgm, programReducer);
  }
}