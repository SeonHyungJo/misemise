import React, { Component } from 'react';
import './Side.css';
import TreeView from'../treeView/TreeView'
let data = [{
  id:1,
  text:"메뉴1",
  icon:"",
  expanded:true,
  children:[{
      id:3,
      selected: true,
      checked: false,
      text:"소메뉴",
      iconObj: {
          name: 'rocket',
          size: '2x',
          spin: true,
          style: { color: 'red' }
      },
      children:[{id:5, text:"소메뉴의 소메뉴"}]
      }
  ]
}]

class SideBox extends Component {

  
  onSelect = (e,a)=>{
    debugger;
    console.log(123);
    return alert(12);
  }

  render() {
    return (
      <>
        <div className = "side">
          <div className = "sidebox">
           <div className = "contents">
              <div className="menu">
              <TreeView   
                onExpand= {this.onSelect} 
                onCollapse= {this.onSelect} 
                onSelect= {this.onSelect} 
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
