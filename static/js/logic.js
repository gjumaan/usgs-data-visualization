// Initial map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
});

// Adding a title layer 
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
}).addTo(myMap);

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
.then(response => {
    // Add color according to depth
    function getColor(d) {
        if (d > 90)
            return "#FF0000"
        else if (d > 70)
            return "#FF6900"
        else if (d > 50)
            return "#FFFF00"
        else if (d > 30)
            return "#FFD300"
        else if (d > 10)
            return "#C2FF00"
        else
            return "#58FF00"
    }
    
    // Add size according to magnitude
    function getSize(mag) {
        if (mag === 0) {
            return 1
        } else
            return mag * 3
    }
    
    // Define styling function for GeoJSON layer
    function style(feature) {
        return {
            radius: getSize(feature.properties.mag),
            fillColor: getColor(feature.geometry.coordinates[2]),
            fillOpacity: 1,
            color: "black",
            weight: 0.5,
            opacity: 0.8
        }
    }

    L.geoJSON(response, {
        style: style,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + 
            "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var depths = ["-10", "10", "30", "50", "70", "90"];
        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
              depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
          }
        return div;
    };
    // Add legend to the map
    legend.addTo(myMap);
})