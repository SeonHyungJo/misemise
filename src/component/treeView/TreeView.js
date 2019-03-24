import React, { Component } from 'react';
import TreeView from  'react-treeviewer';
import './TreeView.css';


class TreeView_ud extends Component {
  render() {
    let data = this.props.data;
    return (
      <>
        <TreeView data={data}/>
      </>
    );
  }
}

export default TreeView_ud;