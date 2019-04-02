import React, { Component } from 'react';
import './TreeView.css';

class TreeView_ud extends Component {

  constructor(props){
    super(props);
    this.state={
      name : "treeView"
    }
  }

  render() {
    let data = this.props.data;
    let printDepth1 = (obj,i)=>(
        <tr className="treeview_row_parent treeview_row_depth1" key={i}>
            <td  className="treeview_col_icon_navi">
              <div className="treeview_icon_navi"/>
            </td>
            <td className="treeview_col_label">
              <span  className="treeview_label">{obj.label}</span>
            </td>
        </tr>
      );

  let printDepth2 = (chdList,i)=>(

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
    );


    let rowList = [];
    data.forEach((o,i) => {
      rowList.push( printDepth1(o,i));
      if(o.children){
          rowList.push( printDepth2(o.children,"child_"+i));
      }
    });

    let row = rowList.map(o=>o);
    return (
      <>
        <div tabIndex="0"  index="0" style={{"marginTop":"5px"}} className="treeview wq_tvw">
          <div tabIndex="-1" className="treeview_group" index="1" label="변환 관리">
            <table treenodevalue="Converting" index="1" cellPadding="0" cellSpacing="0" className="treeview_node treeview_table_node treeview_notleaf treeview_open_child treeview_first_sibling" opened="true">
              <tbody>
                {row}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

export default TreeView_ud;