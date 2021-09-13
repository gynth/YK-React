import { useSelector } from 'react-redux';
import { gfc_setNumberFormat } from '../../../Method/Comm';

function Detailspan(props) {
  const value = useSelector((e) => {
    if(props.flag === 1){
      return e[props.reducer].DETAIL_SCALE;
    }else if(props.flag === 2){
      return e[props.reducer].DETAIL_CARNO;
    }else if(props.flag === 3){
      return e[props.reducer].DETAIL_WEIGHT;
    }else if(props.flag === 4){
      return e[props.reducer].DETAIL_DATE;
    }
  }, (p, n) => {
    return p === n;
  });

  return (
    props.flag !== 3 ? value : gfc_setNumberFormat(value, '0,0', '0R')
  );
}

Detailspan.defaultProps = {
  fontSize: '30',
  margin: '0 0 8px 15px'
}

export default Detailspan;