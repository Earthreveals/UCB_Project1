// Define the map and set the initial view to a specific location and zoom level
var mymap = L.map('map').setView([37.7749, -122.4194], 5);  // Coordinates for San Francisco

// Add a base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(mymap);

// Function to determine color based on earthquake depth
function getColor(d) {
    return d > 90 ? '#800026' :
        d > 70 ? '#BD0026' :
            d > 50 ? '#E31A1C' :
                d > 30 ? '#FC4E2A' :
                    d > 10 ? '#FD8D3C' :
                        '#FEB24C';
}

// Function to determine the radius of the marker based on earthquake magnitude
function getRadius(magnitude) {
    return magnitude * 40000;  // Scale up the magnitude for visibility
}

// Fetch the GeoJSON data from USGS
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

fetch(url)
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circle(latlng, {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup("Magnitude: " + feature.properties.mag +
                    "<br>Depth: " + feature.geometry.coordinates[2] +
                    "<br>Location: " + feature.properties.place);
            }
        }).addTo(mymap);
    });
    // Create the legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            depths = [0, 10, 30, 50, 70, 90],
            labels = [];

        for (var i = 0; i < depths.length; i++) {
            labels.push(
                '<i style="background:' + getColor(depths[i] + 1) + '; width: 18px; height: 18px; display: inline-block;"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] : '+'));
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(mymap);

