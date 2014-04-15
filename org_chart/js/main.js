window.onload = function() { init() };

function init() {
    Tabletop.init({key : "0Ags86_yhVYKHdHBsSEI1RUYwa29QY3BHTnRpWUNhakE", simpleSheet: true, callback: showInfo});
}

function showInfo(root) {

    var width = 960, height = 600;

    var force = d3.layout.force()
        .linkDistance(function(d) { if(d.target.type == "dept") { return  10; } else { return 73; } })
        .linkStrength(0.5)
        .charge(-1190)
        .gravity(.09)
        .size([width, height])
        .on("tick", tick);

    var svg = d3.select(".force_layout").append("svg")
        .attr("width", width)
        .attr("height", height);


    var defs = svg.append( 'defs' );


    var filter = defs.append( 'filter' )
                    .attr( 'id', 'blur' )

    filter.append( 'feGaussianBlur' )
        .attr( 'in', 'SourceAlpha' )
        .attr( 'stdDeviation', 3 )
        .attr( 'result', 'blur' );

    filter.append( 'feOffset' )
        .attr( 'in', 'blur' )
        .attr( 'dx', 2 ) 
        .attr( 'dy', 10 )
        .attr( 'result', 'offsetBlur' );

    var feMerge = filter.append( 'feMerge' );

    feMerge.append( 'feMergeNode' )
        .attr( 'in", "offsetBlur' )

    feMerge.append( 'feMergeNode' )
        .attr( 'in', 'SourceGraphic' );
    //end of shadow effect

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

    update();

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
        .attr("class", function(d) { if (d.target.isprospect == "Yes") {  return "link1"; } else if (d.target.type == "dept") { return "link2"; } else  if (d.target.type == "person" || d.target.type == "org"){ return "link"; } })

        // Update nodes.
        node = node.data(nodes, function(d) { return d.id; });

        node.exit().remove();

        var nodeEnter = node.enter().append('g')
            .each(function(d, i) {
            
                var g = d3.select(this); // That's the svg:g we've just created
                    
                if(d.type == 'dept') {
                    
                    g.append('ellipse')
                    .attr("rx", function(d) { return 55; })
                    .attr("ry", function(d) { return 20; })
                    .style("fill", color);

                    g.append("text")
                    .attr("dy", ".35em")
                    .style('fill', '#fff')
                    .text(function(d) { return d.name; });
                 
                } else if(d.type == "org") {
                    
                    g.append('circle')
                    .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 20; })
                    .style("fill", color);

                    g.append("text")
                    .attr("dy", ".35em")
                    .text(function(d) { return d.name; });
                 
                } else  if(d.type == "person") {

                    g.append('rect')
                    .attr("x", "-60px")
                    .attr("y", "-15px")
                    .attr("width", "124px")
                    .attr("height", "30px")
                    .attr("filter", "url(#blur)")
                    .style("fill", color);

                    g.append("svg:image")
                    .attr("xlink:href", function(d) { return d.img;})
                    .attr("x", "-60px")
                    .attr("y", "-14px")
                    .attr("width", "30px")
                    .attr("height", "30px");

                    g.append("text")
                    .attr("dx", "10px")
                    .attr("dy", "0px")
                    .style("font-size", "10px")
                    .text(function(d) { return d.name; });

                    g.append("text")
                    .attr("dx", "20px")
                    .attr("dy", "10px")
                    .style("fill", "#999")
                    .style("font-size", "9px")
                    .style("font-style", "italic")
                    .text(function(d) { return d.desg; });
                }
            })
            .attr("class", "node")
            .on("click", click)
            .call(force.drag);
               
        node.select("text")
            .style("font-style", function(d) { if (d.isProspect){ return "italic"; } else { return "normal"; }});

    }//end of update()

    function tick() {

        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    function color(d) {

        return d.type == "org" ? "#F0740F" 
            : d.type == "dept" ? "#4CA1DE"
            : d.type == "person" ? "#FFF"
            : d._children ? "#092A42"  // collapsed package
            : d.children ? "#c6dbef" // expanded package
            : "#fd8d3c"; // leaf node
    }

    // Toggle children on click.
    function click(d) {

        if (d3.event.defaultPrevented) return; // ignore drag
        if (d.children) {
        d._children = d.children;
        d.children = null;
        } else {
        d.children = d._children;
        d._children = null;
        }
        update();
    }

    // Returns a json structure of all nodes from the spreadsheet.
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

    // Returns a list of all nodes under the root.
    function flatten(root) {
        var nodes=[], i=0;

        function recurse(node) {
            if (node.children) node.children.forEach(recurse);
            if (!node.id) node.id=++i;
            nodes.push(node);
        }

    recurse(root);
    return nodes;
  }
}