import React from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

import TreeStyle from './TreeView.module.css';

const findJson = (id, TreeView) => {
  let folderYn = false;

  for(let idx in TreeView){
    if(id === TreeView[idx].up_id){
      folderYn = true;
      break;
    }
  }

  return folderYn;
};

const rtnFolderItem = (parent, id, nam) => {

  let input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('id', id);
  input.setAttribute('checked', true);

  parent.appendChild(input);

  let cDiv = document.createElement('div');
  let label = document.createElement('label');
  label.setAttribute('for', id);
  label.setAttribute('class', TreeStyle.folderImg);
  // label.setAttribute('style', 'cursor:')
  label.setAttribute('alt', 'Tree');

  let label1 = document.createElement('label');
  label1.setAttribute('for', id);
  label1.setAttribute('class', TreeStyle.marginLeft);
  label1.textContent = nam;

  label.appendChild(label1);
  cDiv.appendChild(label);
  
  parent.appendChild(cDiv);
};

const rtnDefaultItem = (nam, pgm, props) => {
  let div = document.createElement('div');
  let label = document.createElement('label');
  label.setAttribute('class', TreeStyle.pgmImg);
  label.setAttribute('alt', 'Tree');
  label.setAttribute('data-pgm', pgm);
  label.setAttribute('data-nam', nam);
  label.onclick = (e) => props.onClick(e);
  
  let label1 = document.createElement('label');
  label1.setAttribute('class', TreeStyle.marginLeft);
  label1.setAttribute('data-pgm', pgm);
  label1.setAttribute('data-nam', nam);
  label1.textContent = nam;

  label.appendChild(label1);
  div.appendChild(label);

  return div;
};

const TreeView = (props) => {
  let rootId = Math.floor(Math.random() * 10000000).toString();

  useEffect(() => {
    var element = document.getElementById(rootId);
    let idx = 0;
    let div = null;

    while(true){
      if(idx === props.TreeView.length) break;

      let up_id = props.TreeView[idx].up_id;
      let id  = props.TreeView[idx].id;
      let nam = props.TreeView[idx].nam;
      let pgm = props.TreeView[idx].pgm;

      if(up_id === '' || up_id === null){
        div = null;
        div = document.createElement('div');
        element.appendChild(div);
      }

      let ul = document.getElementById(rootId + (up_id === '' || up_id === null ? id : up_id) + 'Ul');

      if(findJson(id, props.TreeView)){

        //해당 id로 ul을 찾아서 있으면 li로 삽입 없으면ul생성
        if(ul === null){
          rtnFolderItem(div, id, nam);
          let ul = document.createElement('ul');
          ul.setAttribute('id', rootId + (up_id === '' || up_id === null ? id : up_id) + 'Ul');
          div.appendChild(ul);
          element.appendChild(div);
        }else{
          let li = document.createElement('li');
          rtnFolderItem(li, id, nam);

          let cul = document.createElement('ul');
          cul.setAttribute('id', rootId + id + 'Ul');
          li.appendChild(cul);

          ul.appendChild(li);
        }
      }else{
        //해당 id로 ul을 찾아서 있으면 li로 삽입 없으면ul생성
        if(ul === null){
          div.appendChild(rtnDefaultItem(nam, pgm, props));
          element.appendChild(div);
        }else{
          let li = document.createElement('li');
          li.appendChild(rtnDefaultItem(nam, pgm, props));

          ul.appendChild(li);
        }
      }

      idx++;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.TreeView.length])

  return (
    // <div id={rootId} style={{backgroundColor:'red'}} className={TreeStyle.tree}></div>
    <div id={rootId} className={TreeStyle.tree}></div>
  );
};

TreeView.propTypes = {
  folderPoint: PropTypes.string,
  pgmPoint   : PropTypes.string,
  onClick    : PropTypes.func
};

TreeView.defaultProps = {
  folderPoint: 'pointer',
  pgmPoint   : 'pointer',
  onClick    : (e) => {}
};

export default TreeView;