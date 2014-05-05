window.onload = function() { init() };

function init() {
    Tabletop.init({key : "0Ags86_yhVYKHdHBsSEI1RUYwa29QY3BHTnRpWUNhakE", simpleSheet: true, callback: getpeopleSpreadsheet});
}

function getpeopleSpreadsheet(peopleSpreadsheet) {
    var peopleSpreadsheet = peopleSpreadsheet;

    Tabletop.init({key : "0Ags86_yhVYKHdEtWWk5PeUhDWEh2RTVEd3ZiNWFiWVE", simpleSheet: true, callback: gettimezoneSpreadsheet});

    function gettimezoneSpreadsheet(timezoneSpreadsheet) {
        main(peopleSpreadsheet, timezoneSpreadsheet);
    }
}

function main(peopleSpreadsheet, timezoneSpreadsheet) {
    
    //Constants
    var ANGLE_0 = 0;
    var ANGLE_90 = 90;
    var ANGLE_180 = 180;
    var ANGLE_270 = 270;

    var NUM_0 = 0;
    var NUM_6 = 6;
    var NUM_12 = 12;
    var NUM_18 = 18;
    var NUM_23 = 23;
    
    var DEGREES_DIFF = 15;

    var CLOCK_QUADRANT_DIGIT_COLOR = "#FF9B03";
    var DEFAULT_CLOCK_DIGIT_COLOR = "black"
    var CLOCK_POINTER_COLOR = "blue";
    var CLOCK_BG = "#fff"
    var CLOCK_STROKE = "#ccc"

    var CIRCLE2_BG = "black";
    var CIRCLE2_STROKE = "black"
    var GET_CLOCK_DIGITS = 12;

    var CB_SET_1 = 9;
    var CB_SET_2 = 4;
    var CB_SET_3 = 2;

    var ARC_OFFSET = 20;
    var ARC_TEXT_X_OFFSET = 10;
    var ARC_TEXT_Y_OFFSET = 15;
    var ARC_INNER_RADIUS = 30;

    var SVG_LABEL1_X_OFFSET = 10;
    var SVG_LABEL1_Y_OFFSET = 30;
    var SVG_LABEL1_COLOR = "#3182bd";


    var SVG_LABEL2_X_OFFSET = 10;
    var SVG_LABEL2_Y_OFFSET = 70;
    var SVG_LABEL2_COLOR = "#ccc";


    //Variables
    var width = 960, height = 800;
    var radius = 100;
    
    var centerX = width / 2;
    var centerY = height / 2;

    var clockValueOffsetX = [0, 3, 4, 5, 4, 0, -10, -20, -20, -20, -15, -17];
    var clockValueOffsetY = [-4, -3, -1, 0, 10, 14, 15, 14, 10, 0, -1, -3];
    
    var clockDigit = 0;

    var x, y = 0;

    var date = new Date();
    var UTCHours = date.getUTCHours();

    var UTCMinutes = date.getUTCMinutes();
    UTCMinutes = UTCMinutes / 100;
    UTCHours = UTCHours + UTCMinutes;

    var UTCString = date.toUTCString();

    //for legend...
    var timezonePeople = [];

    var timezoneColor = [];

    var personCount = 0;
    var legendCount = 0;

    var colorIndex = -1;
    var colorMapIndex = -1;
    var colorMapName = ['Blues', 'Reds', 'Greens', 'Purples', 'Oranges', 'Greys'];
    var colorSet;

    
    //degrees to radians...
    function toRadians(value) {
        return value * Math.PI / 180
    }

    //get Degrees... for UTC Hours
    function getDegrees(UTCHours) {

        var degrees;

        if(UTCHours >= NUM_0 && UTCHours <= NUM_6 ) {
            degrees = ANGLE_270 + (UTCHours * DEGREES_DIFF);
        }

        if(UTCHours > NUM_6 && UTCHours <= NUM_12 ) {
            UTCHours = UTCHours - NUM_6;
            degrees = ANGLE_0 + (UTCHours * DEGREES_DIFF);
        }

        if(UTCHours > NUM_12 && UTCHours <= NUM_18 ) {
            UTCHours = UTCHours - NUM_12;
            degrees = ANGLE_90 + (UTCHours * DEGREES_DIFF);
        }

        if(UTCHours > NUM_18 && UTCHours <= NUM_23 ) {
            UTCHours = UTCHours - NUM_18;
            degrees = ANGLE_180 + (UTCHours * DEGREES_DIFF);
        }
        
        return degrees;
    }

    //get circumference coordinates for pointer in circle...
    function getCoordinates(radians) {
        var a = radians;

        x = Math.cos(a) * radius + centerX;
        y = Math.sin(a) * radius + centerY;
    }


    var radians = toRadians(getDegrees(UTCHours));
    getCoordinates(radians);

    var lineData = [{ "x": centerX, "y": centerY},  { "x": x,  "y": y }];

    //SVG...
    var svgContainer = d3.select("#time-zone").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    //Circle - CLOCK
    var circle = svgContainer.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", radius)
        .style("fill", CLOCK_BG)
        .style("stroke", CLOCK_STROKE);

    // Small Circle 
    var circle = svgContainer.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", 2)
        .style("fill", CIRCLE2_BG)
        .style("stroke", CIRCLE2_STROKE);


    //label1
    svgContainer.append("text")
        .attr("dx", SVG_LABEL1_X_OFFSET)
        .attr("dy", SVG_LABEL1_Y_OFFSET)
        .text("JMDC Time zone visualization")
        .style("font-size", "24px")
        .style("fill", SVG_LABEL1_COLOR);

    //label2
    svgContainer.append("text")
        .attr("dx", SVG_LABEL2_X_OFFSET)
        .attr("dy", SVG_LABEL2_Y_OFFSET)
        .text(UTCString)
        .style("fill", SVG_LABEL2_COLOR);


    var lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear");

    //Draw the path which shows time on the circle
    svgContainer.append("path")
        .attr("d", lineFunction(lineData))
        .attr("stroke", CLOCK_POINTER_COLOR)
        .attr("stroke-width", 1)
        .attr("fill", "none");

    for(var m = 0; m < GET_CLOCK_DIGITS; m++) {

        radians = toRadians(getDegrees(clockDigit));
        getCoordinates(radians);
        svgContainer.append("text")
            .attr("dx", x + clockValueOffsetX[m])
            .attr("dy", y + clockValueOffsetY[m])
            .text(clockDigit)
            .style("fill", function() { if(clockDigit == NUM_0 || clockDigit == NUM_6 || clockDigit == NUM_12 || clockDigit == NUM_18 ) {return CLOCK_QUADRANT_DIGIT_COLOR;} else {return DEFAULT_CLOCK_DIGIT_COLOR;} });
        clockDigit = clockDigit + 2;
    }

    function getTimeZone (record) {

        for(var j = 0; j < timezoneSpreadsheet.length; j++) {
            if(record.timezone == timezoneSpreadsheet[j].code && record.zone == timezoneSpreadsheet[j].zone) {
                return parseFloat(timezoneSpreadsheet[j].timezone);
            }
        }
    }

    
    //Get Arc's over the circle 
    function getArcs(k,status) {
        var p1, p2;
        
        if(k == 0 && status == "checkin") {
            colorIndex = colorIndex + 1;

            if(colorMapIndex == colorMapName.length - 1) {
                colorMapIndex = - 1;
            }
            colorMapIndex = colorMapIndex + 1;
            colorSet = colorbrewer[colorMapName[colorMapIndex]];
        }

        if(status == "checkin") {
            p1 = parseFloat(checkin[k]) - timezone;
            p2 = parseFloat(checkout[k]) - timezone;
        } else if(status == "availability") {
            p1 = parseFloat(availabilityfrom[k]) - timezone;
            p2 = parseFloat(availabilitytill[k]) - timezone;
        }
            
        p1 = DEGREES_DIFF * p1;
        p1 = toRadians(p1);

        p2 = DEGREES_DIFF * p2;
        p2 = toRadians(p2);

        var arc = d3.svg.arc()
            .innerRadius(ir)
            .outerRadius(ir + ARC_OFFSET)
            .startAngle(p1)
            .endAngle(p2);

        svgContainer.append("svg:path")
            .attr("id", function(){return "path" + personCount})
            .attr("transform", "translate(" + centerX + "," + centerY + ")")
            .attr("fill", function(){ if(status == "checkin") { timezoneColor[colorIndex] = colorSet[CB_SET_1][CB_SET_2]; return colorSet[CB_SET_1][CB_SET_2]; } else if(status == "availability") {return colorSet[CB_SET_1][CB_SET_3];} } )
            .attr("stroke", "#ccc")
            .attr("d", arc)
    }

    for(var i = 0; i < peopleSpreadsheet.length; i++) {
     
        if(peopleSpreadsheet[i].timezone != "") {
            personCount = personCount + 1
            var ir = radius + (ARC_INNER_RADIUS * (personCount));
            var color = peopleSpreadsheet[i].color;
            var name = peopleSpreadsheet[i].name;
            var initials = peopleSpreadsheet[i].initials;
            //Creating Arrays for timezone people and color to display in legend
            timezonePeople[legendCount] = name + " [ " + initials + " ] ";            
            
            legendCount = legendCount + 1;

            // split Multiple time checkin and checkouts
            var checkin = peopleSpreadsheet[i].checkin;
            var checkout = peopleSpreadsheet[i].checkout;
            
            checkin = checkin.split(",");
            checkout = checkout.split(",");
            
            var timezone = getTimeZone(peopleSpreadsheet[i]);

            if(checkin.length == checkout.length) {
                for (var k = 0; k < checkin.length; k++) { 
                    getArcs(k, "checkin");                    
                }

            } else {
                k = 0;
                getArcs(k, "checkin");
            }

            var availabilityfrom =  peopleSpreadsheet[i].availabilityfrom;
            var availabilitytill =  peopleSpreadsheet[i].availabilitytill;

            availabilityfrom = availabilityfrom.split(",");
            availabilitytill = availabilitytill.split(",");

            if(availabilityfrom.length == availabilitytill.length) {
                for (var k = 0; k < availabilityfrom.length; k++) {
                    if(availabilityfrom[k] == '') {
                        //Do nothing
                    } else {
                        getArcs(k, "availability");
                    }
                }
            }
            

            var text = svgContainer.append("text")
                .attr("x", ARC_TEXT_X_OFFSET)
                .attr("dy", ARC_TEXT_Y_OFFSET);

            text.append("textPath")
                .attr("xlink:href", function(){return "#path" + personCount})
                .style("font", "14px verdena,sans-serif")
                .text(initials);
        }
    }

    //Legend...
    d3.select(".people").selectAll("div")
        .data(timezoneColor)
        .enter().append("div")
        .attr("id", "bg")
        .style("background-color", function(d) { return d; });

    d3.select(".people_label").selectAll("p")
        .data(timezonePeople)
        .enter().append("p")
        .text(function(d){return d;});
}