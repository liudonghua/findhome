// noprotect
import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";

import {Map, MarkerList, NavigationControl,MapTypeControl,ScaleControl,OverviewMapControl} from 'react-bmap';

import LocationStore from "../../stores/LocationStore";
import HouseStore from "../../stores/HouseStore";

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
      mapZoom: 15,
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
            this.map = e.target;
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
    let houses  = this.state.houses;
    let house   = {};
    let resp = HouseStore.getHouses(zone);
    if(resp ===undefined || resp.length ===undefined || resp.length===0) return;
    for (const row of resp) {
        house={
            location : row.longitude + ',' + row.latitude,
            text     : row.price
        };
        houses.push(house);
    }
    this.setState({
        houses : houses
    });
  }

  render() {
    if (this.state.center === undefined) {
      return(<div></div>);
    }
    return(
          <Map center={this.state.center}
                zoom={this.state.mapZoom}
                style={styles}
                events={this.getEvents()}
                enableScrollWheelZoom={true}  
            >
            <MarkerList 
                data={this.state.houses} 
                    fillStyle="#ff3333" 
                    animation={true} 
                    isShowShadow={false} 
                    multiple={true} 
                    autoViewport={true}
            />
            <NavigationControl /> 
            <MapTypeControl />
            <ScaleControl />
            <OverviewMapControl />
          </Map>
    );
  }
}

export default withStyles(styles)(HouseMap);