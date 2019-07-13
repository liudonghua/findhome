// noprotect
import React, { Component } from "react";
import intl from 'react-intl-universal';
import { withStyles } from "@material-ui/core/styles";

import {Map, MarkerList, MapTypeControl,ScaleControl,NavigationControl } from 'react-bmap';

import LocationStore from "../../stores/LocationStore";

const styles = {
  height: "90vh",
  width: "100hh",
  padding:  0,
  margin: 0,
};

class HouseMap extends Component {
  _isMounted = false;

  constructor() {
    super();
    this.map=null;
    this.state = {
      center: {},
      houses: []
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
            console.log('tilesloaded', e.type);
           // this.map = e.target;
            this.getHouses();
        },
        load: (e) => {
          this.map = e.target;
          
          this.getHouses();
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
    .then((res) => {console.log(res);return res.json();})
    .then((jsonData) => {
      console.log(jsonData);
     
      let houses  = [];
      let house   = {};
      for (const row of jsonData.data) {
          house={
              location : row.lng + ',' + row.lat,
              text     : row.price+'',
              url      : row.url
          };
          houses.push(house);
      }
      console.log(houses);
      this.setState({
          houses : houses
      });
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        houses : []
      });
    });


  }

  render() {
    if (this.state.center === undefined) {
      return(<div></div>);
    }
    let default_pageFet=`menubar=no,
    resziable=no,
    scrollbars=yes,
    status=no
    `;
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
             fillStyle="#ff3333" 
             animation={false} 
              isShowNumber={false} 
              mini={false}
              textAlign="center" 
              
              autoViewport={false}
              onclick={(item)=>{ 
                
            }} />
            <NavigationControl />
            <MapTypeControl />
            <ScaleControl />
            
          </Map>
        </div>  
    );
  }
}

export default withStyles(styles)(HouseMap);