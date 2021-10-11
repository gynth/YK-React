const Common = (fn, param) => {
  let query = '';

  if(fn === 'pr_menu'){
    query = 
    ' SELECT *              ' +
    '   FROM zm_menu        ' +
    '  WHERE use_yn = \'1\' ' +
    '    AND menu_level = ' + param[0].menu_level;
  }

  return query;
};

module.exports = Common; 