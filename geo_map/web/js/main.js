var width = 960, height = 580, frequencyRange, places = null;

var legendColor = ['rgb(255,255,178)','rgb(254,204,92)','rgb(253,141,60)','rgb(227,26,28)'];
var legendZone = [];
var legendZoneFreq = [];

var color = d3.scale.category10();

var projection = d3.geo.equirectangular()
    .scale(160)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select(".geomap").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

// Import frequencyRange Json file 
d3.json("js/freq_colors.json", function(error, range) {
    frequencyRange = range;
});

function isInFrequencyRange(frequency) {
    
    for(var i = 0; i < frequencyRange.length; i++) {

        if(frequency >= frequencyRange[i].from && frequency <= frequencyRange[i].to) {
            legendZone[i] = frequencyRange[i].zone; 
            legendZoneFreq[i] = " from " + frequencyRange[i].from + " to "+ frequencyRange[i].to; 
            return frequencyRange[i].fill;
        }  
    }

}

// Import Countries Json file 
d3.json("js/countries_freq.json", function(error, custom) {
    places = custom;
});

function hasFrequncey(d) {
    for (var i = 0; i < places.length; i++) {
 
        if(d.id == places[i].id) {
            return places[i].frequency;
        }
    }
}

function hasName(d) {
    for (var i = 0; i < places.length; i++) {
     
        if(d.id == places[i].id) {
            return places[i].name;
        }
    }
}

// Import WorldMap Json file 
d3.json("js/worldmap.json", function(error, world) {
    
    var countries = topojson.feature(world, world.objects.lakes).features;

    svg.selectAll(".country")
        .data(countries)
        .enter().insert("path", ".graticule")
        .attr("class", "country")
        .attr("d", path)
        .attr("id",function(d){return d.id})
        
        .style("fill", function(d, i) { 
            
            var frequency = hasFrequncey(d);
            if(frequency != undefined){
                return isInFrequencyRange(frequency);
            }
            else {
                return "#ccc";
            }

        });

    d3.select(".zone").selectAll("div")
    .data(legendZone)
    .enter().append("div")
    .attr("class", function(d) { return d; });

     d3.select(".zone_label").selectAll("p")
    .data(legendZone)
    .enter().append("p")
    .text(function(d){return d;});

     d3.select(".freq_label").selectAll("p")
    .data(legendZoneFreq)
    .enter().append("p")
    .text(function(d){return d;})


    d3.select(".zone").selectAll("div")
    .data(legendColor)
    .style("background-color", function(d) { return d; });

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");