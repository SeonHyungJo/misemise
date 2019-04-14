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

  handlerClick = (e)=>{
    let openClass = "treeview_open_child";
    let closeClass = "treeview_close_child";
    let target = e.currentTarget.parentNode.parentNode; //tableNode;
    let isOpen = target.classList.contains(openClass);
    if(isOpen){
      target.classList.replace(openClass,closeClass);
      target.attributes.opened.value = "false";
    }else{
      target.classList.replace(closeClass,openClass);
      target.attributes.opened.value = "true";
    }
  }

  render() {
    let label     = this.props.label;
    let idx       = this.props.index;
    let elements  = this.props.elements;  
    let expanded  = this.props.expanded.toString();  
    let expandClass = expanded ? " treeview_open_child" 
                               : " treeview_close_child";
    let tableClassList = "treeview_node treeview_table_node treeview_notleaf treeview_first_sibling"+expandClass

    return ( 
      <>
        <div tabIndex="-1" className="treeview_group" index={idx} label={label} key={idx}   >
          <table treenodevalue="Converting" index={idx} cellPadding="0" cellSpacing="0" opened={expanded} className={tableClassList} >
            <tbody>
              <tr className="treeview_row_parent treeview_row_depth1" onClick={this.handlerClick}>
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
                  <div id={"tw_menu_child_"+{idx}} className="treeview_child">
                    <Branch2 elements={elements} index={idx}/>
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