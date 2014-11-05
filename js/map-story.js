var places = [
    { "type" : "Feature",
    "geometry" : { "type": "Point", 
        "coordinates": [-122.419640, 37.777119] },
    "properties": { "id": "sf", "zoom": 12,
        "icon" : { 
            "iconUrl" : "images/ades_bday.png"
             }
        }
    },
    { "type" : "Feature",
    "geometry": { "type": "Point",
        "coordinates": [-94.61915, 39.11325] },
    "properties": { "id": "kc", "zoom": 12,
        "icon" : { 
            "iconUrl" : "images/kc.png"
             }
        }
    },
    { "type" : "Feature",
    "geometry": { "type": "Point",
    "coordinates": [-112.716408, 36.195267] },
    "properties": { "id": "grandcanyon", "zoom": 10,
        "icon" : { 
            "iconUrl" : "images/gc.png"
             }
        }
    },
    { "type" : "Feature",
    "geometry": { "type": "Point",
    "coordinates": [-121.811142, 36.272491] },
    "properties": { "id": "bigsur", "zoom": 12,
        "icon" : { 
            "iconUrl" : "images/bigsur.png"
             }
        }
    },
    { "type" : "Feature",
    "geometry": { "type": "Point",
    "coordinates": [-118.245323, 34.053490] },
    "properties": { "id": "la", "zoom": 10,
        "icon" : { 
            "iconUrl" : "images/line.png"
             }
        }
    },
    { "type" : "Feature",
    "geometry": { "type": "Point",
    "coordinates": [-87.632446, 41.884251] },
    "properties": { "id": "chicago", "zoom": 12,
        "icon" : { 
            "iconUrl" : "images/chicago.png"
             }
        }
    },
    { "type" : "Feature",
    "geometry": { "type": "Point",
    "coordinates": [-99.133133, 19.431950] },
    "properties": { "id": "mexicocity", "zoom": 12,
        "icon" : { 
            "iconUrl" : "images/mexicocity.jpg"
             }
        }
    },
    { "type" : "Feature",
    "geometry": { "type": "Point",
    "coordinates": [-73.966301, 40.783401] },
    "properties": { "id": "nyc", "zoom": 12,
        "icon" : { 
            "iconUrl" : "images/nyc.png"
             }
        }
    },
    { "type" : "Feature",
    "geometry": { "type": "Point",
    "coordinates": [-105.447998, 20.488300] },
    "properties": { "id": "yelapa", "zoom": 10,
        "icon" : { 
            "iconUrl" : "images/yelapa.png"
             }
        }
    },
    { "type" : "Feature",
    "geometry": { "type": "Point",
    "coordinates": [-93.264931, 44.979031] },
    "properties": { "id": "mpls", "zoom": 12,
        "icon" : { 
            "iconUrl" : "images/mpls.png"
             }
        }
    },
    { "type" : "Feature",
    "geometry": { "type": "Point",
    "coordinates": [-115.139969, 36.171909] },
    "properties": { "id": "vegas", "zoom": 12,
    "icon" : { 
            "iconUrl" : "images/vegas.jpg"
             }
        }
    }
]

L.mapbox.accessToken = 'pk.eyJ1IjoiY29kZWZvcmFtZXJpY2EiLCJhIjoiSTZlTTZTcyJ9.3aSlHLNzvsTwK-CYfZsG_Q';

var map = L.map('map',{
    center : [37.777119, -122.419640],
    zoom : 12,
    zoomControl: false
    });

var stamenLayer = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg').addTo(map);

var placesLayer = L.mapbox.featureLayer(places);

placesLayer.eachLayer(function(place) {
      if (place.feature.properties.icon){
        place.feature.properties.icon.className = "markerimg";
        place.feature.properties.icon.iconAnchor = [125,0];
        place.setIcon(L.icon(place.feature.properties.icon));
      }
    });

// Ahead of time, select the elements we'll need -
// the narrative container and the individual sections
var narrative = document.getElementById('narrative'),
    sections = narrative.getElementsByTagName('section'),
    currentId = '';

setId('cover');

function setId(newId) {
    // If the ID hasn't actually changed, don't do anything
    if (newId === currentId) return;
    // Add the pictures to the map after the first scroll
    if (newId != "you") placesLayer.addTo(map);
    // Otherwise, iterate through layers, zooming to the layer
    placesLayer.eachLayer(function(layer) {
        if (layer.feature.properties.id === newId) {
            map.setView(layer.getLatLng(), layer.feature.properties.zoom);
        }
    });
    // highlight the current section
    for (var i = 0; i < sections.length; i++) {
        sections[i].className = sections[i].id === newId ? 'active' : '';
    }
    // And then set the new id as the current one,
    // so that we know to do nothing at the beginning
    // of this function if it hasn't changed between calls
    currentId = newId;

    // Detect where they are and show that map
    if (newId == 'you') {
        map.removeLayer(placesLayer);
        map.locate();
        map.on('locationfound', function(e) {
            // Start and end points, in x = longitude, y = latitude values
            var start = { x: e.longitude, y: e.latitude };
            var end = { x: -115.139969, y: 36.171909 };
            var generator = new arc.GreatCircle(start, end, { name: 'Join us in Vegas' });
            var line = generator.Arc(100, { offset: 10 });
            lineLayer = L.geoJson(line.json()).addTo(map);
            // map.setView(e.latlng, 10);
            map.fitBounds(lineLayer.getBounds());
        });
    }
}

narrative.onscroll = _(function(e) {
    var narrativeHeight = narrative.offsetHeight;
    var newId = currentId;
    // Find the section that's currently scrolled-to.
    // We iterate backwards here so that we find the topmost one.
    for (var i = sections.length - 1; i >= 0; i--) {
        var rect = sections[i].getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= narrativeHeight) {
            newId = sections[i].id;
        }
    };
    setId(newId);
}).debounce(50);
