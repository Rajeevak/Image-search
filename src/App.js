import React, { Component } from 'react';
import './App.css';
import './SearchBox.css';
import ImageBox from './ImageBox';
import SearchBox from './SearchBox';
import Repeat from 'react-repeat-component';  
import LeftArrow from 'react-icons/lib/fa/angle-left';
import RightArrow from 'react-icons/lib/fa/angle-right';
import CloseIcon from 'react-icons/lib/md/close';
import Globe from 'react-icons/lib/fa/globe';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
const GoogleImages = require('google-images');



//import GoogleImages from 'google-images'

//AIzaSyDg8d2xwszq9rke0FQg0PqZz0MRLQkaSY0    - API_KEY
//AIzaSyArjlEkkRTuDPU4aUxqy69LrfNcIPdwmM0
//AIzaSyBLgNDWdH432YWXYHcaaprHQkypC6WmKt4
//AIzaSyAhhHhe-qJqpPQnBIXR3SwXF2ZN1t_fHEc
//AIzaSyBastoTVoBTrAWnTwG_87t5ovuyiriasCg
//AIzaSyBOoyBqnJEEfIfH4LxR-XtrOT63HyLqW_o

//002456323622844074645:i8ss2uh-svy   - CSE_ID
//002456323622844074645:mu9pdzdlxe8
//002427026951565356174:zwevwk6d_xe
//003827239288207266803:nv_jozjewu4
//012165125777042312828:y-lz4uhizj8
//006675799719344992711:ijlbvb0ihzy

//002456323622844074645:fww_jkavuai

const client = new GoogleImages('002456323622844074645:i8ss2uh-svy' /* CSE_ID */, 'AIzaSyDg8d2xwszq9rke0FQg0PqZz0MRLQkaSY0' /* API_KEY */);    // Google image search plugin. Using Google's Custom search Engine. 
let completeSearch = false;
let isItRefresh = false;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {images: [],
                  searchKey: '',
                  imageIndex : 0,
                  isOpened: false,
                  pageNo: 1,
                isNewQuery: true};
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    if(window.location.pathname){                 // Find path and load with search text and open image with index.  eg. /India/3  India is the search text and 3 is the                                                   image index. 
      let locationPathItems = window.location.pathname.split('/');
      this.setState({searchKey: locationPathItems[1]});
      isItRefresh = true;
      let total = 2;
      completeSearch = false;
      if(Math.floor(locationPathItems[2]/10) > 2){
        total = Math.floor(locationPathItems[2]/10);
      }
      for (let i = 0, p = Promise.resolve(); i <= total; i++) {
        p = p.then(_ => new Promise(resolve => {
                if(locationPathItems[1] !== ''){
                  client.search(locationPathItems[1], {page: i===0? 1 : i*10}).then(images => {   //  Google Custom Search API.
                    this.setState({pageNo: i===0? 1 : i*10});
                    const newArray = [...this.state.images, ...images]
                    console.log(newArray);                                      //  Appending more iamges.   
                    this.setState({                                             //  Load more if it's not a new query text.
                      images: i === 0 ? images : newArray 
                    });
                    if(locationPathItems[2] !== undefined && i === total){
                      this.setState({imageIndex: Number(locationPathItems[2])});
                      this.setState({isOpened: true});
                      isItRefresh = false;
                    }
                    resolve();
                  });
                }else{
                  isItRefresh = false;
                }
              
            }                         
        ));
      }
      
    }

    window.addEventListener("scroll", this.handleScroll);  // Listen for scroll bottom
    window.addEventListener("keyup", this._handleKeyPress);  // Listen for scroll bottom

  }

  componentWillUpdate(nextProps, nextState){
    if(this.state.searchKey !== nextState.searchKey){ // Load image if query text changed. 
      if(!isItRefresh){
        for(let i=0, p = Promise.resolve(); i<=2; i++){
          p = p.then(_ => new Promise(resolve => {
            if(nextState.searchKey !== ''){
              client.search(nextState.searchKey, {page: i===0? 1 : i*10}).then(images => {   //  Google Custom Search API.
                this.setState({pageNo: i===0? 1 : i*10});
                const newArray = [...this.state.images, ...images]
                console.log(newArray);                                      //  Appending more iamges.   
                this.setState({                                             //  Load more if it's not a new query text.
                  images: i === 0 ? images : newArray 
                });
                resolve();
              });
            }
          }                         
          ));
        }
      }else{
        isItRefresh = false;
      }
    }
    
    if(nextState.imageIndex === this.state.images.length-1){
      this.searchImages(this.state.searchKey, this.state.pageNo+10, false);
    }
  }

  componentWillUnmount() {    
    window.removeEventListener("scroll", this.handleScroll);     // Listen for scroll bottom
  }

  searchImages(search_key, _pageNo, isNewQuery){                    //  Search Images. 
    if(search_key !== ''){
      client.search(search_key, {page: _pageNo}).then(images => {   //  Google Custom Search API.
        this.setState({pageNo: _pageNo});
        const newArray = [...this.state.images, ...images]
        console.log(newArray);                                      //  Appending more iamges.   
        this.setState({                                             //  Load more if it's not a new query text.
          images: isNewQuery ? images : newArray 
        });
        if(_pageNo === 20){
          completeSearch = true;
        }
      });
    }
  }; 

  handleScroll() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {                             //Load more images on scrolling down.
      this.setState({isNewQuery : false});
      this.searchImages(this.state.searchKey, this.state.pageNo+10, false)
      this.setState({pageNo: this.state.pageNo+10})
    }
  }

  goLeft = () => {                                               // Navigate to left for detailed views of image.
    if(this.state.imageIndex !== 0){
      this.setState({imageIndex : this.state.imageIndex-1})
    }
  }
  goRight = () =>{                                               // Navigate to right for detailed views of image.
    if(this.state.imageIndex !== this.state.images.length-1){
      this.setState({imageIndex : this.state.imageIndex+1})
    }
  }
  closeNavigation = () =>{                                       // Close Detailed view.   
      this.setState({isOpened : false})
  }
  
  _handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') {                              //Go left using right arrow
      document.getElementById('go-left').click();
    }else if(e.key === 'ArrowRight'){                         //Go right using right arrow
      document.getElementById('go-right').click();
    }else if(e.key === 'Escape'){                           //Escape to close detailed view
      this.closeNavigation();
    }
  };

  render() {
    return (
      <Router>
      <div className="App">
        <div className="Seacrh-Box">                            {/* Search text box */}
           <SearchBox funct={(_search) => this.setState({searchKey : _search})} searchText={this.state.searchKey}></SearchBox>
        </div>
        <Route path={'/'+this.state.searchKey} render={() => (  
            <Repeat times={this.state.images.length} order="asc" wrapper="div" className="Images">
                {(i) =>
                  <Link to={'/'+this.state.searchKey+'/'+i} key={i}>
                  <ImageBox key={i} url={this.state.images[i]} _setIndex={(_search) => this.setState({imageIndex : i, isOpened: true})} ></ImageBox>
                  </Link>
                }
          </Repeat>
          )}>
        </Route>                                                {/* Search Result Images */}
        

        {this.state.isOpened && <div className='clicked-item' onKeyPress={this._handleKeyPress}>  {/* Detailed View Of Image */}
          <Link to={'/'+this.state.searchKey+'/'+(this.state.imageIndex === 0 ? this.state.imageIndex : this.state.imageIndex-1)}>
            <span className='navigate left-arrow' id='go-left' onClick={this.goLeft}><LeftArrow size={30}/></span>
          </Link>
          <Link to={'/'+this.state.searchKey+'/'+((this.state.imageIndex === this.state.images.length-1) ? this.state.imageIndex : (Number(this.state.imageIndex)+1))}>
            <span className='navigate right-arrow' id='go-right' onClick={this.goRight}><RightArrow size={30}/></span>
          </Link>
          <span className='close-button' onClick={this.closeNavigation}><CloseIcon size={30}/></span>
          <div className="clicked-image-container">
            <div className="dummy"></div>
            <div className="img-container">
              <img src={this.state.images[this.state.imageIndex].url} alt="" />
            </div>
            <div className='resol-of-img'><h5 className='no-margin'>{this.state.images[this.state.imageIndex].width}<CloseIcon/>{this.state.images[this.state.imageIndex].height}</h5></div>
          </div>
          <div className='rel-image-container'>
            <div><h3 className='no-margin'>{this.state.images[this.state.imageIndex].description}</h3></div>
            <div><button className='visit-page'><Globe/><a href={this.state.images[this.state.imageIndex].parentPage} target={'_blank'}>Visit</a></button></div>
          </div>
        </div>}    
      </div>
      </Router>
    );
  }
}

export default App;
