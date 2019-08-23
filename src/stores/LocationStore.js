import { EventEmitter } from "events";
import "whatwg-fetch";

class LocationStore extends EventEmitter {
  getLocation(callbackFunc) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        callbackFunc(position);
      }, (error) => {
        this.getGeoIPLocation(callbackFunc);
      },{enableHighAccuracy: true, timeout: 5000});
    } else {
      this.getGeoIPLocation(callbackFunc);
    }
  }
  
  getGeoIPLocation(callbackFunc) {
   //callbackFunc({coords: {latitude: 39.92, longitude: 116.46}});
    callbackFunc({coords: {latitude: 22.6, longitude: 113.9 }});
  }
}

const locationStore = new LocationStore();

export default locationStore;
