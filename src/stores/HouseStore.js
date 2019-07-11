class HouseStore{


  getHouses(zone){
    var formData  = new FormData();

    for(var name in zone) {
      formData.append(name, zone[name]);
    }

    fetch('http://127.0.0.1:8000/getRange/',
      {
        method: 'post',
        headers: {},
        mode:   'no-cors',
        body:    formData //JSON.stringify(zone)
      }
    )
    .then(response => response.json())
    .then((jsonData) => {
      console.log(jsonData);
      return jsonData;
    })
    .catch((error) => {
      // handle your errors here
      console.error(error);
      return [];
    })
    
  }

}
const houseStore = new HouseStore();
export default houseStore;
