import React from 'react';
import './Common.css';

const SearchDiv = (props) => {

  return (
    <div className="search_line" >
      <div className="line">
        {props.children}
      </div>
    </div>
  );
};

export default SearchDiv;