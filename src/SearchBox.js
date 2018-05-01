import React, { Component } from 'react';
import './App.css';
import Search from 'react-icons/lib/fa/search';
import { Link } from 'react-router-dom'

// Search Text Box

class SearchBox extends Component{
    state = {
        value : this.props.searchText
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            document.getElementById('search-images').click();
            //this.props.funct(this.state.value);
        }
    };

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.searchText})
    }

    render(){
        return (
            <div>
                <span className="Search-Label">Search:</span>
                <input className="Search-Box" placeholder='Search for images' value={this.state.value} onChange={(event) => this.setState({value : event.target.value})} onKeyPress={this._handleKeyPress}/>
                <Link to={`/${this.state.value}`}>
                    <span className="Search-Icon" id='search-images' onClick={() => this.props.funct(this.state.value)}><Search/></span>
                </Link>
            </div>);
    }
}

export default SearchBox;