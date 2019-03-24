import React, { Component } from 'react';
import TreeView from  'react-treeviewer';
import './TreeView.css';


class TreeView_ud extends Component {

  render() {
    let data = this.props.data;
    let onSelect = this.props.onSelect;
    let onExpand = this.props.onExpand;
    //왜 이벤트 안걸림 ㅠㅠ
    return (
      <>
        <TreeView
          data={data}
          onSelect={onSelect}
          onExpand={onExpand}
        ></TreeView>
      </>
    );
  }
}

export default TreeView_ud;