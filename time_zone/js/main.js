window.onload = function() { init() };

function init() {
    Tabletop.init({key : "0Ags86_yhVYKHdHBsSEI1RUYwa29QY3BHTnRpWUNhakE", simpleSheet: true, callback: getSpreadSheet1});
}

function getSpreadSheet1(root) {
    var root = root;

    Tabletop.init({key : "0Ags86_yhVYKHdEtWWk5PeUhDWEh2RTVEd3ZiNWFiWVE", simpleSheet: true, callback: getSpreadSheet12});

    function getSpreadSheet12(root2) {
        main(root, root2);
    }
}

function main(root, root2) {

    var width = 960, height = 800;
    var radius = 100;
    //var color = ['rgb(239,243,255)','rgb(189,215,231)','rgb(107,174,214)','rgb(33,113,181)'];
    var centerX = width/2;
    var centerY = height/2;

    var clockValueoOffsetX = [0, 3, 4, 5, 4, 0, -10, -20, -20, -20, -15, -17];
    var clockValueoOffsetY = [-4, -3, -1, 0, 10, 14, 13, 14, 10, 0, -1, -3];

    var x, y = 0;

    var date = new Date();
    var UTCHours = date.getUTCHours();

    var UTCMinutes = date.getUTCMinutes();
    UTCMinutes = UTCMinutes/100;
    UTCHours = UTCHours + UTCMinutes;

    var UTCString = date.toUTCString();

    //for legend...
    var timezonePeople = [];

    var timezoneColor = [];  


    //degrees to radians...
    function toRadians(value)
    {
        return value * Math.PI / 180
    }

    //get Degrees... for UTC Hours
    function getDegrees(UTCHours) {

        var degrees;

        if(UTCHours >= 0 && UTCHours <= 6 ) {
            degrees = 270 + (UTCHours * 15);
        }

        if(UTCHours > 6 && UTCHours <= 12 ) {
            UTCHours = UTCHours -6;
            degrees = 0 + (UTCHours * 15);
        }

        if(UTCHours > 12 && UTCHours <= 18 ) {
            UTCHours = UTCHours -12;
            degrees = 90 + (UTCHours * 15);
        }

        if(UTCHours > 18 && UTCHours <= 23 ) {
            UTCHours = UTCHours -18;
            degrees = 180 + (UTCHours * 15);
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

    var lineData = [{ "x": centerX,   "y": centerY},  { "x": x,  "y": y }];

    var svgContainer = d3.select("#time-zone").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")


    svgContainer.append("text")
        .attr("dx", 10)
        .attr("dy", 30)
        .text("JMDC Time zone visualization")
        .style("font-size", "24px")
        .style("fill", "#3182bd");

    svgContainer.append("text")
        .attr("dx", 10)
        .attr("dy", 70)
        .text(UTCString)
        .style("fill", "#888");


    var lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear");
    

    //Circle
    var circle = svgContainer.append("circle")
        .attr("cx", width/2)
        .attr("cy", height/2)
        .attr("r", radius)
        .style("fill", "#fff")
        .style("stroke", "#ccc");
        svgContainer.append("text")

    // Small Circle 
    var circle = svgContainer.append("circle")
        .attr("cx", width/2)
        .attr("cy", height/2)
        .attr("r", 2)
        .style("fill", "black")
        .style("stroke", "black");
        svgContainer.append("text")

    //Draw the path which shows time on the circle
    svgContainer.append("path")
        .attr("d", lineFunction(lineData))
        .attr("stroke", "blue")
        .attr("stroke-width", 1)
        .attr("fill", "none");

    var n =0;
    for(var m = 0; m < 12; m++) {

        radians = toRadians(getDegrees(n));
        getCoordinates(radians);
        svgContainer.append("text")
            .attr("dx", x + clockValueoOffsetX[m])
            .attr("dy", y + clockValueoOffsetY[m])
            .text(n)
            .style("fill", function() { if(n == 0 || n == 6 || n == 12 || n == 18 ) {return "#FF9B03";} else {return "black";} });
            console.log();
        n = n + 2;
    }

    function getTimeZone (record) {
        for(var j = 0; j< root2.length; j++) {
            if(record.timezone == root2[j].code && record.zone == root2[j].zone) {
                return parseFloat(root2[j].timezone);
            }
        }
    }

    var count = 0;
    var legendcount = 0;


    //Get Arc's over the circle 
    function getArcs(k) {
        var getcheckin = parseFloat(checkin[k]) - timezone;
            getcheckin = 15 * getcheckin;
            getcheckin = toRadians(getcheckin);
            
        var getcheckout = parseFloat(checkout[k]) - timezone;
        getcheckout = 15 * getcheckout;
        getcheckout = toRadians(getcheckout);

        var arc = d3.svg.arc()
            .innerRadius(ir)
            .outerRadius(ir + 20)
            .startAngle(getcheckin)
            .endAngle(getcheckout);

        svgContainer.append("svg:path")
            .attr("id", function(){return "path" + count})
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .attr("fill", color )
            .attr("stroke", "#ccc")
            .attr("d", arc);
    }

    for(var i = 0; i< root.length; i++) {
     
        if(root[i].timezone != "") {
            count = count + 1
            var ir = radius + (30 * (count) );
            var color = root[i].color;
            var name = root[i].name;
            var initials = root[i].intials
        
            //Creating Arrays for timezone people and color to display in legend
            timezonePeople[legendcount] = name + " [ " + initials + " ] ";
            timezoneColor[legendcount] = color;
            
            legendcount = legendcount + 1;

            // split Multiple time checkin and checkouts
            var checkin = root[i].checkin;
            var checkout = root[i].checkout;
            
            checkin = checkin.split(",");
            checkout = checkout.split(",");
            
            var timezone = getTimeZone(root[i]);

            if(checkin.length == checkout.length) {
                
                for (var k = 0; k < checkin.length; k++) { 
                    getArcs(k);
                }

            } else {

                getArcs(0);
            }

            var text = svgContainer.append("text")
                .attr("x", 10)
                .attr("dy", 15);

            text.append("textPath")
                .attr("stroke", "black")
                .attr("xlink:href", function(){return "#path" + count})
                .style("font", "14px verdena,sans-serif")
                .style("font-weight", 100)
                .text(initials);
        }
    }

    //Attach Div's and Paragraph to DOM elements.
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