import React, { Component } from 'react';
import './TreeView.css';
import Branch2 from './branch2.js';

class Branch extends Component {

  constructor(props){
    super(props);
    this.state={
      name : "branch"
    } 
  }

  render() {
    let label     = this.props.label;
    let i         = this.props.index;
    let elements  = this.props.elements;  

    let handlerClick = (e)=>{
      let openClass = "treeview_open_child";
      let closeClass = "treeview_close_child";
      let target = e.currentTarget.querySelector("table.treeview_table_node");
      let isOpen = target.classList.contains(openClass);
      if(isOpen){
        target.classList.replace(openClass,closeClass);
      }else{
        target.classList.replace(closeClass,openClass);
      }
    }

    return ( 
      <>
        <div tabIndex="-1" className="treeview_group" index="1" label={label} key={i} name={i} onClick={handlerClick} >
          <table treenodevalue="Converting" index="1" cellPadding="0" cellSpacing="0" className="treeview_node treeview_table_node treeview_notleaf treeview_open_child treeview_first_sibling" opened="true">
            <tbody>
              <tr className="treeview_row_parent treeview_row_depth1" >
                <td  className="treeview_col_icon_navi">
                  <div className="treeview_icon_navi"/>
                </td>
                <td className="treeview_col_label">
                  <span  className="treeview_label">{label}</span>
                </td>
              </tr>
              <tr className="treeview_row_child">
                <td  className="treeview_noguideline treeview_col_depth1"/>
                <td colSpan="2">
                  <div id="tw_menu_child_1" className="treeview_child">
                    <Branch2 elements={elements} index={i}/>
                  </div>
                </td>
            </tr>

           
            </tbody>
          </table>
        </div>


      
      </>
    );
  }
}

export default Branch;