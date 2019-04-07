import React, { Component } from 'react';
import './TreeView.css';


class Branch2 extends Component {

  constructor(props){
    super(props);
    this.state={
      name : "branch2"
    } 
  }

  render() {
    let chdList = this.props.elements;
    let prefix      = "child_"+this.props.index;

    let depth_2 = chdList.map((o,j)=>{
      return(
        <div tabIndex="-1"  className="treeview_group" index="2" label={o.label} key={prefix+j} name={prefix+j}>
          <table  treenodevalue={o.value} index="2" cellPadding="0" cellSpacing="0" className="treeview_node treeview_table_node treeview_leaf treeview_open_child treeview_first_sibling">
            <tbody> 
              <tr className="treeview_row_parent treeview_row_depth2">
                <td  className="treeview_col_icon_navi">
                  <div className="treeview_icon_none">
                  </div>
                </td>
                <td className="treeview_none"/>
                <td className="treeview_col_label">
                  <span className="treeview_label">{o.label}</span>
                </td>
              </tr>
            </tbody>
        </table>
      </div>
      )
    });
    return ( 
      <>
        {depth_2}
      </>
    );
  }
}

export default Branch2;