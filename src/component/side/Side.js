import React, { Component } from 'react';
import './Side.css';
import TreeView from'../treeView/TreeView'

//db 조회.
let data = [{
  id:1,
  label:"Depth1",
  icon:"dept1",
  expanded:"true",
  children:[{
      id:3,
      label:"Depth1_1",
      value:"/two",
      selected: true,
      icon:"dept2"
      },{
        id:3,
        label:"Depth1_2",
        value:"/three",
        selected: true,
        icon:"dept2"
        }
  ]
},
{
  id:1,
  label:"Depth2",
  icon:"dept1",
  expanded:true,
  children:[{
      id:3,
      label:"Depth2_1",
      value:"/two",
      selected: true,
      icon:"dept2"
      },{
        id:3,
        label:"Depth2_2",
        value:"/three",
        selected: true,
        icon:"dept2"
        }
  ]
}];

class SideBox extends Component {

  render() {
    return (
      <>
        <div className = "side">
          <div className = "sidebox">
           <div className = "contents">
              <div className="menu">
                <TreeView  data={data}  />
              </div>
           </div>
          </div>
        </div>
      </>
    );
  }
}

export default SideBox;
