import React, { Component } from 'react';
import TreeView from  'react-treeviewer';
import './TreeView.css';


class TreeView_ud extends Component {

  constructor(props){
    super(props);
    this.state={
      name : "treeView"
    }
    // 새로운 생성자 메서드를 만든다.
  }

  //  static temp =  this.props.data;
  //  data = ()=>{return temp;}
  // // onSelect = this.props.onSelect;
  //  //onExpand = this.props.onExpand;
  render() {
    //debugger;
    //왜 이벤트 안걸림 ㅠㅠ
    return (
      <>
        <TreeView
          data={this.props.data}
          onSelect={()=>alert(this.state.name)}
        ></TreeView>
      </>
    );
  }
}

export default TreeView_ud;