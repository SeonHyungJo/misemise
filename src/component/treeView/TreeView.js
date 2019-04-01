import React, { Component } from 'react';
import './TreeView.css';
import Branch from'../treeView/TreeView'



class TreeView_ud extends Component {

  constructor(props){
    super(props);
    this.state={
      name : "treeView"
    }
  }

  render() {
    let data = this.props.data;

    let printRow = (obj,i,type)=>{

      // if(false){
      //  return(
			// 	<tr className="treeview_row_child">
			// 		<td  classNameName="treeview_noguideline treeview_col_depth1"/>
			// 		<td colspan="2">
			// 			<div className="treeview_child">

			// 				<div tabindex="-1"  className="treeview_group" index="2" label="분석">
			// 					<table i treenodevalue="/views/analyzer.xml" index="2" cellpadding="0" cellspacing="0" className="treeview_node treeview_table_node treeview_leaf treeview_open_child treeview_first_sibling">
			// 						<tbody>
			// 							<tr className="treeview_row_parent treeview_row_depth2">
			// 								<td  className="treeview_col_icon_navi">
			// 									<div className="treeview_icon_none">
			// 									</div>
			// 								</td>
			// 								<td className="treeview_none">
			// 								</td>
			// 								<td className="treeview_col_label">
			// 									<span  className="treeview_label">분석</span>
			// 								</td>
			// 							</tr>
			// 						</tbody>
			// 					</table>
			// 				</div>
			// 			</div>
			// 		</td>
			// 	</tr>
      //   );
      // }
        
        return(
          <tr className="treeview_row_parent treeview_row_depth1" key={i}>
            <td  className="treeview_col_icon_navi">
              <div className="treeview_icon_navi">
              </div>
            </td>
            <td className="treeview_col_label">
              <span  className="treeview_label">{obj.label}</span>
            </td>
        </tr>
      );
    }

    let rowList = [];

    data.forEach((o,i) => {
      rowList.push( printRow(o,i,"dep1"));
      if(o.children){
        o.children.forEach((chd,j)=>{
          rowList.push( printRow(chd,j,"dep2"));
        })
      }
    });

    let row = rowList.map((o,i)=>o);

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