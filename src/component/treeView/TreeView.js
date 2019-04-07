import React, { Component } from 'react';
import './TreeView.css';
import Branch from './branch.js';
import Branch2 from './branch2.js';

class TreeView_ud extends Component {

  constructor(props){
    super(props);
    this.state={
      name : "treeView"
    }
  }

  render() {
    let printDepth1 = (obj,i)=>(
          <Branch label={obj.label} index={i}/>
        );
      
      let printDepth2 = (chdList,i)=>(
            <Branch2 elements={chdList} index={i}/>
          );
        
        
    let rowList = [];
    let data = this.props.data;
        data.forEach((o,i) => {
          rowList.push( printDepth1(o,i));
          let elements = o.children;
          if(elements){
              rowList.push( printDepth2(elements,"child_"+i));
          }
        });

    let rows = rowList.map(o=>o);
    return (
      <>
        <div tabIndex="0"  index="0" style={{"marginTop":"5px"}} className="treeview wq_tvw">
          <div tabIndex="-1" className="treeview_group" index="1" label="변환 관리">
            <table treenodevalue="Converting" index="1" cellPadding="0" cellSpacing="0" className="treeview_node treeview_table_node treeview_notleaf treeview_open_child treeview_first_sibling" opened="true">
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

export default TreeView_ud;