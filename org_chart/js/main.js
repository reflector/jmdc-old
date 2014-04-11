window.onload = function() { init() };

function init() {
    Tabletop.init({key : "0Ags86_yhVYKHdHBsSEI1RUYwa29QY3BHTnRpWUNhakE", callback: showInfo, simpleSheet: true});
}

function showInfo(root) {

    var width = 960, height = 560;

    var force = d3.layout.force()
        .linkDistance(function(d) { if(d.target.type == "dept") { return 20 } else { return 95} })
        .linkStrength(0.5)
        .charge(-1190)
        .gravity(0.1)
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
        .attr("class", function(d) { console.log(d.target); if (d.target.isprospect == "Yes") {  return "link1"} else if (d.target.type == "dept") {return "link2"} else  if(d.target.type == "person" || d.target.type == "org"){ return "link"}  })

        // Update nodes.
        node = node.data(nodes, function(d) { return d.id; });

        node.exit().remove();

        var nodeEnter = node.enter().append('g')
            .each(function(d, i) {
            
                var g = d3.select(this); // That's the svg:g we've just created
                    
                if(d.type == 'dept' || d.type == "org") {
                    
                    g.append('circle')
                    .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 20; })
                    .style("fill", color);

                    g.append("text")
                    .attr("dy", ".35em")
                    .text(function(d) { if(d.type == "person"){ return d.name } else if (d.type == "dept") { return d.name } else if (d.type == "org") { return d.name} });
                 
                } else  if(d.type == "person") {

                    g.append('rect')
                    .attr("width", "120px")
                    .attr("height", "30px")
                    .attr("filter", "url(#blur)")
                    .style("fill", color);

                    g.append("text")
                    .attr("dx", "70px")
                    .attr("dy", "15px")
                    .style("font-size", "10px")
                    .text(function(d) { if(d.type == "person"){ return d.name } else if (d.type == "dept") { return d.name } else if (d.type == "org") { return d.name} });

                    g.append("text")
                    .attr("dx", "75px")
                    .attr("dy", "25px")
                    .style("fill", "#999")
                    .style("font-size", "9px")
                    .style("font-style", "italic")
                    .text(function(d) { return d.desg });

                    g.append("svg:image")
                    .attr("xlink:href", "/img/male.png")
                    .attr("width", "30px")
                    .attr("height", "30px");


                }
            })
            .attr("class", "node")
            .on("click", click)
            .call(force.drag);
               
        node.select("text")
            .style("font-style", function(d) { if(d.isProspect){ return "italic" } else { return "normal" }});

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
            : d.type == "dept" ? "#3182bd"
            : d.type == "person" ? "#BADD82"
            : d.isProspect = Yes ? "#BADD82"
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

    // Returns a list of all nodes under the root.
    function flatten(root) {
        var nodes = [], id = 0, name;
        var children = [];

        function recurse(node) {

            for(var i = 0; i < node.length; i++) {
              
                if (!node[i].id) {
                  node[i].id = ++id;                  
                }

                name = node[i].name;
                
                for(var j = 0; j < node.length; j++) {
                  
                  if(name == node[j].manager) {
                    
                    children.push(node[j]);//push the children to node

                  }
                }

                node[i].children = children;
                children = [];
                nodes.push(node[i]);
            }
        }

        recurse(root);
        return nodes;
    } 
}