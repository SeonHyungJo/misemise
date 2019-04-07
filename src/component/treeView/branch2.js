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
    let chdList = this.props.elements;
    let i       = this.props.index;
    return ( 
      <>
        <tr className="treeview_row_child" key={i}>
          <td  className="treeview_noguideline treeview_col_depth1"/>
          <td colspan="2">
            <div className="treeview_child">
              <div id="tw_menu_child_1" className="treeview_child">
                {chdList.map((o,j)=>(
                      <div tabindex="-1"  className="treeview_group" index="2" label={o.label} key={i+"_"+j}>
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
                  ))}
                </div>
            </div>
          </td>
      </tr>
      </>
    );
  }
}

export default Branch;