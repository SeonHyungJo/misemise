import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Header.css';

class HeaderIcon extends Component {

    static defaultProps = {
      name : "아이콘"
    }
  
    static propTypes = {  //(transform-calss-properties문법)
      name : PropTypes.string.isRequired //타입설정
    }
   
    handlerLink = (e)=>{
      return alert("경로이동"+this.props.value);
    }
  
    render() {
      return (
        <>
            <div onClick={this.handlerLink} className="icon">
              {this.props.name}
            </div>
        </>
      );
    }
  }
  
  
  export default HeaderIcon;
  