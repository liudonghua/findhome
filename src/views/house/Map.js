// noprotect
import React, { Component } from "react";
//import intl from 'react-intl-universal';
import { withStyles } from "@material-ui/core/styles";

import {Map, MarkerList,InfoWindow, MapTypeControl,ScaleControl,NavigationControl } from 'react-bmap';

import LocationStore from "../../stores/LocationStore";

//full screen map style
const styles = {
  height: "90vh",
  width: "100hh",
  padding:  0,
  margin: 0,
};

class HouseMap extends Component {
  constructor() {
    super();
    this.state = {
      center: {},
      houses: [],
      info:   {},
      isClose: true,
      isTile: false,
      isClick: false
    };
    this.setCurrentPosition = this.setCurrentPosition.bind(this);
    this.getHouses = this.getHouses.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.setCurrentPosition();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  setCurrentPosition() {
    LocationStore.getLocation(position => {
       let center = this.state.center;
      center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
      }
      if (this._isMounted) {
        this.setState({
          center: center,
        });
      }
    });
  }

  getEvents() {
    return {
        tilesloaded: (e) => {
          this.getHouses();
            
          
          
          this.setState({
            center: e.target.getCenter(),
            isTile: true
          });
          

        },
        load: (e) => {
          this.map = e.target;
          this.getHouses();
        }

    };
  }

  getInfoEvents(){
    return {
      close: (e) =>{
       this.setState({
          isClose: true
       });
        
      },
      clickclose: (e) =>{
        
      }
    }
  }

  getHouses(){
    if(this.map === undefined || this.map===null){
      return;
    }
    let bound   = this.map.getBounds();
    let csw     = bound.getSouthWest();
    let cne     = bound.getNorthEast();
    let zone    = {
      east:   cne.lng,
      west:   csw.lng,
      south:  csw.lat,
      north:  cne.lat
    };

    var formData  = new FormData();

    for(var name in zone) {
      formData.append(name, zone[name]);
    }

    fetch("http://127.0.0.1:8000/getRange/",{
      method: "post",
      body:    formData
    })
    .then((res) => {return res.json();})
    .then((jsonData) => {     
      let houses  = [];
      let house   = {};
      for (const row of jsonData.data) {
          house={
              location  : row.lng + ',' + row.lat,
              lng       : row.lng,
              lat       : row.lat,
              text      : '￥'+row.price,
              img       : row.img,
              detail    : row.detail,
              url       : row.url
          }; 
          houses.push(house);
      }
      if(this._isMounted)
        this.setState({
          houses : houses
        });
    })
    .catch((error) => {
      console.error(error);
      if(this._isMounted)
      {
        this.setState({
        houses : []
        });
      }
    });


  }

  render() {
    if (this.state.center.lat === undefined || this.state.center.lng === undefined) {
      return(<div></div>);
    }
    this.infoWindow = null;
    if((this.state.isClose===false && this.state.isTile===true)|| this.state.isClick===true){
      let text  = "<div><div><a href=\""+this.state.info.url+"\" ><img  alt=\""+this.state.info.text+"\" src=\""+this.state.info.img+"\" /></a></div><div>"+this.state.info.detail+"</div></div>"

      this.infoWindow=<InfoWindow position={{lng:this.state.info.lng,lat:this.state.info.lat}}
        text={text}
        enableAutoPan={false}
        events={this.getInfoEvents()}
        title={this.state.info.text}
       />;

    }

    return(
        <div>
          <Map center={this.state.center}
                zoom='15'
                style={styles}
                events={this.getEvents()}
                enableScrollWheelZoom={true}  
            >
            <MarkerList
                      data={this.state.houses}
                      onClick={(item)=>{ 
                        if(this._isMounted){
                          let houseinfo = this.state.houses[item];
                          this.isClose = false;
                          

                          this.setState({
                            info: houseinfo,
                            isClick: true,
                            center: {
                              lng:  houseinfo.lng,
                              lat:  houseinfo.lat
                            },
                          });
                        }
                       }}
                      fillStyle="#ff3333" 
                      animation={false} 
                      isShowNumber={false} 
                      mini={false}
                      textAlign="center" 
                      autoViewport={false}
                        
              />
          
            {this.infoWindow}
            <NavigationControl />
            <MapTypeControl />
            <ScaleControl />
            
          </Map>
        </div>  
    );
  }
}

export default withStyles(styles)(HouseMap);