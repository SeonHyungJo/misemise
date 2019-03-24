import React, { Component } from 'react';
import './Side.css';
//import TreeView from  'react-treeviewer';
import TreeView from'../treeView/TreeView'
let data = [{
  id:1,
  text:"메뉴1",
  icon:"folder",
  expanded:true,
  children:[{
      id:3,
      selected: true,
      checked: false,
      text:"Child 1",
      iconObj: {
          name: 'rocket',
          size: '2x',
          spin: true,
          style: { color: 'red' }
      },
      children:[{id:5, text:"Grandchild 1"}]
      }
  ]
}]

class SideBox extends Component {
  render() {
    return (
      <>
        <div className = "side">
          <div className = "sidebox">
           <div className = "contents">
              <div className="menu">
              <TreeView
                data={data}
              />
              </div>
           </div>
          </div>
        </div>
      </>
    );
  }
}

export default SideBox;
