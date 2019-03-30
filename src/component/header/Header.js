import React, { Component } from 'react';
import './Header.css';
import './HeaderIcon';
import PropTypes from 'prop-types';
import HeaderIcon from './HeaderIcon';


class Header extends Component {

  /*
    props : 읽기전용
    state : 컴포넌트 자체가 지닌값, 내부에서 읽고 업데이트 가능한 값.
  */
  state = {
    iconNum: 0
  }


  static defaultProps = {
    name : "헤더"
  }

  static propTypes = {  //(transform-calss-properties문법)
    name : PropTypes.string.isRequired //타입설정
  }
 
  handlerGoHome = (e)=>{
    this.setState({iconNum: this.state.iconNum+1});
    return alert(this.state.iconNum);
  }

  render() {
    return (
      <>
        <div className = "container">
          <div className = "headerMenu"  onClick={this.handlerGoHome}>
            {this.props.name}
          </div>
          <div className = "iconContainer">
             {this.props.data.map((o) => {
                  return (
                    <HeaderIcon name={o.name} value={o.value}/>
                  );
              })}
          </div>
    
        </div>
      </>
    );
  }
}


export default Header;
