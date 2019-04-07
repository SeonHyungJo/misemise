import React, { Component } from 'react';
import './TreeView.css';


class Branch extends Component {

  constructor(props){
    super(props);
    this.state={
      name : "branch"
    } 
  }

  render() {
    let label = this.props.label;
    let i = this.props.index;
    return ( 
      <>
         <tr className="treeview_row_parent treeview_row_depth1" key={i}>
            <td  className="treeview_col_icon_navi">
              <div className="treeview_icon_navi"/>
            </td>
            <td className="treeview_col_label">
              <span  className="treeview_label">{label}</span>
            </td>
        </tr>
      </>
    );
  }
}

export default Branch;