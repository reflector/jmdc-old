window.onload = function() { init() };

function init() {
    Tabletop.init({key : "0Ags86_yhVYKHdHBsSEI1RUYwa29QY3BHTnRpWUNhakE", simpleSheet: true, callback: getSpreadSheet});
}

function getSpreadSheet(root) {
    var root = root;

    Tabletop.init({key : "0Ags86_yhVYKHdEtWWk5PeUhDWEh2RTVEd3ZiNWFiWVE", simpleSheet: true, callback: getSpreadSheet2});

    function getSpreadSheet2(root2) {
        main(root, root2);
    }
}

function main(root, root2) {

    var width = 960, height = 800;
    //var color = ['rgb(239,243,255)','rgb(189,215,231)','rgb(107,174,214)','rgb(33,113,181)'];
    var centerX = width/2;
    var centerY = height/2;

    var clockvalueoffsetX = [3, 0, 4, 5, 4, 0, -10, -20, -20, -20, -15, -17];
    var clockvalueoffsetY = [-4, -100, -4, 0, 10, 14, 13, 14, 10, 0, -1, -3];

    var x, y = 0;

    var now = new Date;

    var radius = 100;

    var date = new Date();
    var utc_hours = date.getUTCHours();

    var UTCstring = (new Date()).toUTCString();

    var timezonePeople = [];

    var timezoneColor = [];  


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
        return x,y;
    }


    var radians = toRadians(getDegrees(utc_hours));
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
        .attr("dx", 533)
        .attr("dy", 309)
        .text("2");

    svgContainer.append("text")
    .attr("dx", 570)
    .attr("dy", 345)
    .text("4");


    svgContainer.append("text")
    .attr("dx", 570)
    .attr("dy", 460)
    .text("8");


    svgContainer.append("text")
        .attr("dx", 530)
        .attr("dy", 500)
        .text("10");


    svgContainer.append("text")
        .attr("dx", width/2 -10)
        .attr("dy", height/2 + radius + 13)
        .text("12");


    svgContainer.append("text")
        .attr("dx", 410)
        .attr("dy", 500)
        .text("14");

    svgContainer.append("text")
        .attr("dx", width/2 + radius + 5)
        .attr("dy", height/2)
        .text("6");

     svgContainer.append("text")
        .attr("dx", 373)
        .attr("dy", 460)
        .text("16");

    svgContainer.append("text")
        .attr("dx", width/2 - radius - 20)
        .attr("dy", height/2)
        .text("18");

    svgContainer.append("text")
        .attr("dx", 377)
        .attr("dy", 349)
        .text("20");

    svgContainer.append("text")
        .attr("dx", 412)
        .attr("dy", 310)
        .text("22");

    function getTimeZone (record) {
        for(var j = 0; j< root2.length; j++) {
            if(record.timezone == root2[j].code && record.zone == root2[j].zone) {
                return parseFloat(root2[j].timezone);
            }
        }
    }
    var count = 0;
    var legendcount = 0;
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

            } else {

                var getcheckin = parseFloat(checkin[0]) - timezone;
                getcheckin = 15 * getcheckin;
                getcheckin = toRadians(getcheckin);
                    
                var getcheckout = parseFloat(checkout[0]) - timezone;
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

    //Attach Div's and partagraph to dom elements.
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
