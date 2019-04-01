import React, { Component } from 'react';
import './TreeView.css';


class Branch extends Component {

  constructor(props){
    super(props);
    this.state={
      name : "branch"
    }
    // 새로운 생성자 메서드를 만든다.
  }

  render() {
    return (
      <>
        <div id="tw_menu_child_1" class="treeview_child">
          {this.props.data.map((o,i)=>{
              <div tabindex="-1"  class="treeview_group" index="2" label={o.label} key={i}>
                <table  treenodevalue={o.value} index="2" cellpadding="0" cellspacing="0" class="treeview_node treeview_table_node treeview_leaf treeview_open_child treeview_first_sibling">
                  <tbody>
                    <tr class="treeview_row_parent treeview_row_depth2">
                      <td  class="treeview_col_icon_navi">
                        <div class="treeview_icon_none">
                        </div>
                      </td>
                      <td class="treeview_none">
                      </td>
                      <td class="treeview_col_label">
                        <span class="treeview_label">{o.label}</span>
                      </td>
                    </tr>
                  </tbody>
              </table>
            </div>
          })}
     
     
      </div>
      </>
    );
  }
}

export default Branch;