/// MAP ///

var mymap = L.map('mapid', {
    scrollWheelZoom: false,
    maxZoom: 8,
    minZoom: 6
}
                 ).setView([48.5, 31.3], 6);


//// STYLES FOR THE MAP /////


var style = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd'
});


// decide which style to use
style.addTo(mymap);




//////// MAP ////////

d3.csv('data/streetsmap.csv')
    .then(function(data) {
    
    
    // select unique street names from data
    var oldstreets = data.map(function(d) {
        return  d.streetName
    })
    
    var streets = Array.from(new Set(oldstreets))

    
    // select street name that will be shown first
    var choice = 'Калинова';
    
    // Show name of the street!!!!
    d3.select('span.map-header').append('text').text('\"' + choice + '\"')

    
    // filter df according to choice
    dataChoice = data.filter(function(d) {
        return d['streetName'] == choice
    })
    

    // create geojson from csv
    var geojson = dataChoice.map(function (d) {
        return {
            type: "Feature",
            properties: d,
            geometry: {
                type: "Point",
                coordinates: [+d.Long, +d.Lat]
            }
        }
    });
    
    // create new layer
    var streetLayer = L.geoJSON(geojson, {

        pointToLayer : function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius : 3,
                fillColor : "#5C75D2",
                color : "#4358A3",
                weight : 1,
                opacity : 1,
                fillOpacity : 0.8
            });
        }
    })
    
    // add layer to map
    mymap.addLayer(streetLayer);
    
    
    
    //// MouseOver popup
    
    var popup = L.popup();
//    var circle = L.circle();
    
    function mouseOnMap(e) {
        popup
            .setLatLng(e.latlng)
            .setContent('<strong>' + e.layer.feature.properties.city + '</strong>, <br>' + e.layer.feature.properties.oblast)
            .openOn(mymap);
    }
    
    streetLayer.on('mouseover', mouseOnMap)
    
    
    
    
    
    
    
    
    
    //////// TYPEAHEAD //////////
    
    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;

    // an array that will be populated with substring matches
            matches = [];

    // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });
            cb(matches);
        };
    };

    
    $('#streets-list .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'streets',
        limit: 10,
        source: substringMatcher(streets)
    });
    
    
    $('.typeahead').on('typeahead:selected', function(evt, item) {
        
        // change the choice
        choice = item;
        
        // Show name of the street!!!!
        d3.select('span.map-header').text('\"' + choice + '\"')
        
        //delete old layer
        streetLayer.remove();
        
        
        // and create the new one according to new choice
        
        dataChoice = data.filter(function(d) {
            return d['streetName'] == choice
        });

        // create geojson from csv
        var geojson = dataChoice.map(function (d) {
            return {
                type: "Feature",
                properties: d,
                geometry: {
                    type: "Point",
                    coordinates: [+d.Long, +d.Lat]
                }
            }
        });
        
        streetLayer = L.geoJSON(geojson, {

            pointToLayer : function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius : 3,
                    fillColor : "#5C75D2",
                    color : "#4358A3",
                    weight : 1,
                    opacity : 1,
                    fillOpacity : 0.8
                });
            }
        })
    
        // add layer to map
        mymap.addLayer(streetLayer);
    
    
    
        //// MouseOver popup

        var popup = L.popup();
//        var circle = L.circle();

        function mouseOnMap(e) {
            popup
                .setLatLng(e.latlng)
                .setContent('<strong>' + e.layer.feature.properties.city + '</strong>, <br>' + e.layer.feature.properties.oblast)
                .openOn(mymap);
        }

        streetLayer.on('mouseover', mouseOnMap)
        
        
        
    })
})











                    