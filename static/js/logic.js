function createMap(trends_object) {

    // Create our initial map object
    // Set the longitude, latitude, and the starting zoom level
    const myMap = L.map("map").setView([30.269782, -97.739777], 2);

    // Add a tile layer (the background map image) to our map
    // Use the addTo method to add objects to our map
    baseMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    }).addTo(myMap);

    // Create an overlayMaps object to hold the keywords layer
    keywords = []
    non_keywords = ['', 'index','geoName', 'country', 'latitude', 'longitude']
    for (key in trends_object[0]){
        if(!non_keywords.includes(key)){
            keywords.push(key)
        }
    }

    var overlayMaps = {}
    keywords.forEach(function(k,i) {
        overlayMaps[k.toUpperCase()] = createLayer(trends_object, k, i)
    })
     
    L.control.layers(overlayMaps).addTo(myMap);

}

const   colors = [  "#1f78b4",  "#33a02c",
    "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6",
    "#6a3d9a", "#b15928"]

function createLayer(valuesList, key, index) {

    // Loop through the values array
    filteredList = valuesList.filter(feature => (feature[key] > 0))
    
    const locations = filteredList.map(feature => {
        // For each earthquake, create a circle and bind a popup 
        // with the details of the earthquake
        const magnitude = feature[key];
        const coord = [Number(feature["latitude"]), Number(feature['longitude'])];
        const popupMsg = "<h3>" + feature['geoName'] + "</h3><hr>" + 
                            "<p>"  + magnitude + "</p><hr>" +
                            "<p>"  + feature['country']  + "</p>";
        const dot = L.circle(coord, {
            color: colors[index], 
            fillColor: colors[index % 11],
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

