import { EventEmitter } from "events";
import "whatwg-fetch";
class HouseStore extends EventEmitter{


  getHouses(zone){
    var formData  = new FormData();

    for(var name in zone) {
      formData.append(name, zone[name]);
    }

    fetch("http://127.0.0.1:8000/getRange/",{
      method: "post",
      mode:   "no-cors",
      body:    formData
    })
    .then((res) => {console.log(res);return res.json();})
    .then((jsonData) => {
      console.log(jsonData);
      return jsonData;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
    
  }

}
const houseStore = new HouseStore();
export default houseStore;
