import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './HeaderIcon.css';

class HeaderIcon extends Component {

    static propTypes = {  //(transform-calss-properties문법)
      data : PropTypes.array.isRequired //타입설정
    }
   
    handlerLink = (e)=>{
      return alert("경로 이동:"+e.target.href);
    }

    render() {
      let itemes = this.props.data.map((o,i) =>  (
            <a onClick={this.handlerLink} className="icon" href={o.value} key={i}>
                {o.name}
            </a>
          ));

      return (
        <>
          <div className = "iconContainer">
              {itemes} 
          </div>
        </>
      );
    }
  }
  export default HeaderIcon;
  