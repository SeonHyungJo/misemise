import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './HeaderIcon.css';

class HeaderIcon extends Component {

    static propTypes = {  //(transform-calss-properties문법)
     // data : PropTypes.object.isRequired //타입설정
    }
   
    handlerLink = (e)=>{
      return alert("경로 이동"+e.target.title);
    }

    render() {
      return (
        <>
         <div className = "iconContainer">
             {
                this.props.data.map((o) => {
                  return (
                    <div onClick={this.handlerLink} className="icon" title={o.value} >
                        {o.name}
                    </div>
                  );
              })} }
          </div>
        </>
      );
    }
  }
  export default HeaderIcon;
  