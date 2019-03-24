import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
  fn_iconClick = (e)=>{
    return alert(e.type+"이벤트");
  }

  render() {
    return (
      <>
        <div className = "container">
          <div className = "headerMenu">
            헤더 내용22
          </div>
          <div className = "icon" onClick={this.fn_iconClick} >
            아이콘
          </div>
        </div>
      </>
    );
  }
}

export default Header;
