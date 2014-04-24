window.onload = function() { init() };

function init() {
    Tabletop.init({key : "0Ags86_yhVYKHdGx2THRzX3FiMHBHR014ZUNpWkF6S3c", simpleSheet: true, callback: showInfo});
}

function showInfo(root) {

    var width = 960, height = 800;

    var centerX = width/2;
    var centerY = height/2;

    var x, y = 0;

    var now = new Date;

    var radius = 100;

    var date = new Date();
    var utc_hours = date.getUTCHours();

    var UTCstring = (new Date()).toUTCString();

    //degrees to radians...
    function toRadians(value)
    {
        return value * Math.PI / 180
    }

    //get Degrees... for UTC Hours
    function getDegrees(utc_hours) {

        var degrees;
        if(utc_hours >= 0 && utc_hours <= 6 ) {
            degrees = 270 + (utc_hours * 15);
        }

        if(utc_hours > 6 && utc_hours <= 12 ) {
            utc_hours = utc_hours -6;
            degrees = 0 + (utc_hours * 15);
        }

        if(utc_hours > 12 && utc_hours <= 18 ) {
            utc_hours = utc_hours -12;
            degrees = 90 + (utc_hours * 15);
        }

        if(utc_hours > 18 && utc_hours <= 23 ) {
            utc_hours = utc_hours -18;
            degrees = 180 + (utc_hours * 15);
        }
        
        return degrees;
    }

    //get circumference coordinates for pointer in circle...
    function getCoordinates(radians) {
        var a = radians;
        x = Math.cos(a) * radius + centerX;
        y = Math.sin(a) * radius + centerY;
    }


    var radians = toRadians(getDegrees(utc_hours));
    getCoordinates(radians);

    var lineData = [{ "x": centerX,   "y": centerY},  { "x": x,  "y": y }];




    var svgContainer = d3.select("body").append("svg")
    .attr("id", "time-zone")
    .attr("width", width)
    .attr("height", height)
    .append("g")


    svgContainer.append("text")
    .attr("dx", 10)
    .attr("dy", 30)
    .text("JMDC Time zone visualization")
    .style("font-size", "24px")
    .style("fill", "#ccc");

    svgContainer.append("text")
    .attr("dx", 10)
    .attr("dy", 70)
    .text(UTCstring)
    .style("fill", "#888");


    var lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear");



    //Draw the path which shows time on the circle
    svgContainer.append("path")
        .attr("d", lineFunction(lineData))
        .attr("stroke", "blue")
        .attr("stroke-width", 20)
        .attr("fill", "none");

    //Draw the Circle
    var circle = svgContainer.append("circle")
    .attr("cx", width/2)
    .attr("cy", height/2)
    .attr("r", radius)
    .style("fill", "#fff")
    .style("stroke", "#ccc");
    svgContainer.append("text")

    var circle = svgContainer.append("circle")
    .attr("cx", width/2)
    .attr("cy", height/2)
    .attr("r", 2)
    .style("fill", "black")
    .style("stroke", "black");
    svgContainer.append("text")

    svgContainer.append("path")
        .attr("d", lineFunction(lineData))
        .attr("stroke", "blue")
        .attr("stroke-width", 1)
        .attr("fill", "none");

    svgContainer.append("text")
    .attr("dx", width/2 -3)
    .attr("dy", height/2 - radius -5)
    .text("0");

    svgContainer.append("text")
    .attr("dx", width/2 -10)
    .attr("dy", height/2 + radius + 13)
    .text("12");

    svgContainer.append("text")
    .attr("dx", width/2 + radius + 5)
    .attr("dy", height/2)
    .text("6");

    svgContainer.append("text")
    .attr("dx", width/2 - radius - 20)
    .attr("dy", height/2)
    .text("18");

    for(var i = 0; i< root.length; i++) { 
        
        var rowNumber = parseInt(root[i].rowNumber);
        var ir = radius + (30 * rowNumber);

        var name = root[i].name;
        var color = root[i].color;
        var checkin = parseFloat(root[i].checkin);
        checkin = checkin - parseFloat(root[i].timezone);
        checkin = 15 * checkin;
        checkin = toRadians(checkin);
        var checkout = parseFloat(root[i].checkout);
        checkout = checkout - parseFloat(root[i].timezone);
        checkout = 15 * checkout;
        checkout = toRadians(checkout);

        var arc = d3.svg.arc()
        .innerRadius(ir)
        .outerRadius(ir + 20)
        .startAngle(checkin)
        .endAngle(checkout);

        svgContainer.append("svg:path")
        .attr("id", function(){return "path" + rowNumber})
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("fill", color)
        .attr("stroke", "#ccc")
        .attr("d", arc);

        var text = svgContainer.append("text")
        .attr("x", 10)
        .attr("dy", 15);

        text.append("textPath")
        .attr("stroke", "black")
        .attr("xlink:href", function(){return "#path" + rowNumber})
        .style("font", "14px verdena,sans-serif")
        .style("font-weight", 100)
        .text(name);
    }
}