/* 1차원 배열만 테스트함 2, 3은 필요시 수정 */

//key, value로 json 찾는 함수
export const jsonRtn = (json, key, value) => {
  for(let idx in json){
    if(value === json[idx][key]){
      return [json[idx], idx];
    }
  }
}

// key, value로 index 찾는 함수
export const jsonIndex = (json, key, value) => {
  for(let idx in json){
    if(value === json[idx][key]){
      return idx;
    }
  }
}

// key, value로 배열내용변경 함수
export const jsonSplice = (json, key, value, newValue) => {
  json = json.filter((e) => e[key] !== value);
  json.push(newValue);

  return json;
};

//key, value로 지정된 내용 찾기
export const jsonValue = (json, key, value, findValue) => {
  for(let idx in json){
    if(value === json[idx][key]){
      return json[idx][findValue];
    }
  }
}

// 지정된 key의 max값
export const jsonMaxValue = (json, key) => {
  let maxValue = json.map((e) => {
    return e[key];
  })

  maxValue = Math.max.apply(null, maxValue);
  if(!isFinite(maxValue)) maxValue = 0;
  if(isNaN(maxValue)) maxValue = 0;

  return maxValue;
}