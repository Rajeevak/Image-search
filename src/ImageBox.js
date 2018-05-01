import React, { Component } from 'react';
import './ImageBox.css';

// Image Box for every search result.

class ImageBox extends Component{
    render(){
        return (
            <div className="ImageBox" >
                    <img src={this.props.url['url']} className="img-item" alt="Could not Load" onClick={this.props._setIndex}/>
                </div>);
    } 
}
export default ImageBox;