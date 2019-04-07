import React, { Component } from 'react';
import './TreeView.css';
import Branch from './branch.js';


class TreeView_ud extends Component {

  constructor(props){
    super(props);
    this.state={
      name : "treeView"
    }
  }

  render() {
 
    let data = this.props.data;
    let rows = data.map( (obj, idx)=>(
          <Branch label={obj.label} index={idx} elements ={obj.children} key={idx}/>
        ));
    return (
      <>
        <div tabIndex="0"  index="0" style={{"marginTop":"5px"}} className="treeview wq_tvw">
          {rows}
        </div>
      </>
    );
  }
}

export default TreeView_ud;