function createMap(trends_object) {

    // Create our initial map object
    // Set the longitude, latitude, and the starting zoom level
    const myMap = L.map("map").setView([41.87194,12.56738], 2);

    // Add a tile layer (the background map image) to our map
    // Use the addTo method to add objects to our map
    baseMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    }).addTo(myMap);

    // Create an overlayMaps object to hold the keywords layer
    keywords = []
    non_keywords = ['', 'index','geoName', 'country', 'latitude', 'longitude','name','total']
    for (key in trends_object[0]){
        if(!non_keywords.includes(key)){
            keywords.push(key)
        }
    }
    console.log(keywords)

    var overlayMaps = {}
    keywords.forEach(function(k,i) {
        overlayMaps[k.toUpperCase()] = createLayer(trends_object, k, i)
    })
     
    L.control.layers(overlayMaps).addTo(myMap);

}

var colors = ['#FF33E3', '#FFB533', '#33FF4F', '#FF4F33', '#B533FF'];

function createLayer(valuesList, key, index) {

    // Loop through the values array
    filteredList = valuesList.filter(feature => (feature[key] > 0))
    
    const locations = filteredList.map(feature => {
        // For each earthquake, create a circle and bind a popup 
        // with the details of the earthquake
        const magnitude = feature[key];
        const coord = [Number(feature["latitude"]), Number(feature['longitude'])];
        const popupMsg =  "<p>"   + feature['name'].toUpperCase()  + " "+ magnitude + "</p>";
        const dot = L.circle(coord, {
            color: colors[index % 5], 
            fillColor: colors[index % 5],
            fillOpacity: 0.75,
            radius: (10000 * Math.round(magnitude))
         }).bindPopup(popupMsg);

        return dot;
    })

    return new L.layerGroup(locations);

}


(async function(){
    const data = await d3.json("/region")
    createMap(data)
})()

