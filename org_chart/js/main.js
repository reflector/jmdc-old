window.onload = function() { init() };

function init() {
    Tabletop.init({key : "0Ags86_yhVYKHdHBsSEI1RUYwa29QY3BHTnRpWUNhakE", simpleSheet: true, callback: showInfo});
}

function showInfo(root) {

//Constants...

    var LEAF_NODE_BG = "#fd8d3c";
    var CLASS_LINK = "link";
    var CLASS_LINK1 = "link1";
    var CLASS_LINK2 = "link2";

  //Force Layout..
    var LAYOUT_CHARGE = -1190;
    var LAYOUT_LINKDISTANCE_DEFAULT = 73;
    var LAYOUT_LINKDISTANCE_DEPT = 10;
    var LAYOUT_LINKSTRENGTH = 0.5;
    var LAYOUT_GRAVITY = .09;
  //

  //Ellipse Label..
    var CIRCLE_LABEL1_Y = ".35em";
  //

  //SVG: Ellipse..
    var ELLIPSE_X = 55;
    var ELLIPSE_Y = 20;
  //

  //Ellipse Label..
    var ELLIPSE_LABEL1_Y = ".35em";
    var ELLIPSE_LABEL1_COLOR = "#fff"; 
  //

  //SVG: Rectangle..
    var RECT_X = "-60px";
    var RECT_Y = "-15px";
    var RECT_WIDTH = "124px", RECT_HEIGHT = "30px";
  //

  //People Icon..
    var IMG_X = "-60px";
    var IMG_Y = "-14px";
    var IMG_WIDTH = "30px", IMG_HEIGHT = "30px";
  //

  //Person Label..
    var LABEL_NAME_X = "10px";
    var LABEL_NAME_Y = "0px";
    var NAME_FONT_SIZE = "10px"; 
  //

  //Desg Label..
    var LABEL_DESG_X = "20px";
    var LABEL_DESG_Y = "10px";
    var DESG_LABEL_COLOR = "#999";
    var DESG_FONT_SIZE = "9px";
    var DESG_FONT_STYLE = "italic";  
  //

  //Colors..
    var ORG_NODE_BG = "#F0740F";
    var DEPT_NODE_BG = "#4CA1DE";
    var PERSON_NODE_BG = "#FFF";
  //
//


//Variables...

    var width = 960, height = 600;

//


//Force Layout Declaration...

    var force = d3.layout.force()
        .linkDistance(function(d) { if(d.target.type == "dept") { return  (LAYOUT_LINKDISTANCE_DEPT); } else { return LAYOUT_LINKDISTANCE_DEFAULT; } })
        .linkStrength(LAYOUT_LINKSTRENGTH)
        .charge(LAYOUT_CHARGE)
        .gravity(LAYOUT_GRAVITY)
        .size([width, height])
        .on("tick", tick);

    var svg = d3.select(".force_layout").append("svg")
        .attr("width", width)
        .attr("height", height);

//End Force Layout Declaration


//Node Shadow...

    var defs = svg.append('defs');


    var filter = defs.append('filter')
        .attr('id', 'blur')

    filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 3)
        .attr('result', 'blur');

    filter.append('feOffset')
        .attr('in', 'blur')
        .attr('dx', 2) 
        .attr('dy', 10)
        .attr('result', 'offsetBlur');

    var feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode')
        .attr('in", "offsetBlur')

    feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');

//End Node Shadow

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

    update();

//Node Update...

    function update() {

        var i = 0;
        root = structure(root);
        var nodes = flatten(root);
        var links = d3.layout.tree().links(nodes);


    // Restart the force layout.
        force.nodes(nodes)
            .links(links)
            .start();

    // Update links.
        link = link.data(links, function(d) { return d.target.id; });

        link.exit().remove();

        link.enter().insert("line", ".node")
        .attr("class", function(d) { if (d.target.isprospect == "Yes") {  return CLASS_LINK1; } else if (d.target.type == "dept") { return CLASS_LINK2; } else  if (d.target.type == "person" || d.target.type == "org"){ return CLASS_LINK; } })

    // Update nodes.
        node = node.data(nodes, function(d) { return d.id; });

        node.exit().remove();

        var nodeEnter = node.enter().append('g')
            .each(function(d, i) {
            
                var g = d3.select(this); // That's the svg:g we've just created
                    
                if(d.type == 'dept') {
                    
                    g.append('ellipse')
                    .attr("rx", function(d) { return ELLIPSE_X; })
                    .attr("ry", function(d) { return ELLIPSE_Y; })
                    .style("fill", color);

                    g.append("text")
                    .attr("dy", ELLIPSE_LABEL1_Y)
                    .style('fill', ELLIPSE_LABEL1_COLOR)
                    .text(function(d) { return d.name; });
                 
                } else if(d.type == "org") {
                    
                    g.append('circle')
                    .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 20; })
                    .style("fill", color);

                    g.append("text")
                    .attr("dy", CIRCLE_LABEL1_Y)
                    .text(function(d) { return d.name; });
                 
                } else  if(d.type == "person") {

                    g.append('rect')
                    .attr("x", RECT_X)
                    .attr("y", RECT_Y)
                    .attr("width", RECT_WIDTH)
                    .attr("height", RECT_HEIGHT)
                    .attr("filter", "url(#blur)")
                    .style("fill", color);

                    g.append("svg:image")
                    .attr("xlink:href", function(d) { return d.img;})
                    .attr("x", IMG_X)
                    .attr("y", IMG_Y)
                    .attr("width", IMG_WIDTH)
                    .attr("height", IMG_HEIGHT);

                    g.append("text")
                    .attr("dx", LABEL_NAME_X)
                    .attr("dy", LABEL_NAME_Y)
                    .style("font-size", NAME_FONT_SIZE)
                    .text(function(d) { return d.name; });

                    g.append("text")
                    .attr("dx", LABEL_DESG_X)
                    .attr("dy", LABEL_DESG_Y)
                    .style("fill", DESG_LABEL_COLOR)
                    .style("font-size", DESG_FONT_SIZE)
                    .style("font-style", DESG_FONT_STYLE)
                    .text(function(d) { return d.desg; });

                }
            })
            .attr("class", "node")
            .on("click", click)
            .call(force.drag);
               
        node.select("text")
            .style("font-style", function(d) { if (d.isProspect){ return "italic"; } else { return "normal"; }});

    }
//End update()

    function tick() {

        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    function color(d) {

        return d.type == "org" ? ORG_NODE_BG 
            : d.type == "dept" ? DEPT_NODE_BG
            : d.type == "person" ? PERSON_NODE_BG
            : LEAF_NODE_BG; // leaf node
    }

    // Toggle children on click..
    function click(d) {

        if (d3.event.defaultPrevented) return; // ignore drag..
        
        if (d.children) {

            d._children = d.children;
            d.children = null;
        
        } else {
        
            d.children = d._children;
            d._children = null;
        
        }
        
        update();
    }


// Returns a json structure of all nodes from the spreadsheet..
    function structure(root) {

        var nodes = [], id = 0, name, index = 0;
        var children = [];

        function grandChildrenNode(element, node) {

            var grandChildren = [];
            var isChildren = false;
            
            for (var i = 0; i < node.length; i++) {

                if (element.name == node[i].manager) {

                    isChildren = true;
                    grandChildren.push(node[i]);
                    node[i] = grandChildrenNode(node[i], node);

                }

            }

            if(isChildren == true) {

                element.children = grandChildren;
                grandChildren = [];

            }
                return element;
        }

        function childrenNode(node) {

            for (var i = 0; i < node.length; i++) {
                
                if(node[i].manager == "") {

                    name = node[i].name;
                    root = node[i];

                    for (var j = 0; j < node.length; j++) {

                        if(name == node[j].manager) {

                            node[j] = grandChildrenNode(node[j], node);
                            children.push(node[j]);//push the children to node

                        }
                    }

                    root.children = children;
                    children = [];

                } 

            }
        }

        childrenNode(root);
        return root;
    }
//


// Returns a list of all nodes under the root..
    function flatten(root) {

        var nodes = [], i = 0;

        function recurse(node) {

            if (node.children) node.children.forEach(recurse);
            if (!node.id) node.id=++i;
            nodes.push(node);
            
        }

        recurse(root);
        return nodes;
    }
//
}