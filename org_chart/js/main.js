var width=960,
      height=560,
      root;

  var force=d3.layout.force()
      .linkDistance(function(d) { if(d.target.type == "dept") { return 20 } else { return 95} })
      .linkStrength(0.5)
      .charge(-1190)
      .gravity(0.1)
      .size([width, height])
      .on("tick", tick);

  var svg=d3.select(".force_layout").append("svg")
      .attr("width", width)
      .attr("height", height);


 var defs = svg.append( 'defs' );

// append filter element
var filter = defs.append( 'filter' )
                 .attr( 'id', 'blur' ) /// !!! important - define id to reference it later

// append gaussian blur to filter
filter.append( 'feGaussianBlur' )
      .attr( 'in', 'SourceAlpha' )
      .attr( 'stdDeviation', 3 ) // !!! important parameter - blur
      .attr( 'result', 'blur' );

// append offset filter to result of gaussion blur filter
filter.append( 'feOffset' )
      .attr( 'in', 'blur' )
      .attr( 'dx', 2 ) // !!! important parameter - x-offset
      .attr( 'dy', 10 ) // !!! important parameter - y-offset
      .attr( 'result', 'offsetBlur' );

// merge result with original image
var feMerge = filter.append( 'feMerge' );

// first layer result of blur and offset
feMerge.append( 'feMergeNode' )
       .attr( 'in", "offsetBlur' )

// original image on top
feMerge.append( 'feMergeNode' )
       .attr( 'in', 'SourceGraphic' );
// end filter stuff

  var link=svg.selectAll(".link"),
      node=svg.selectAll(".node");

  d3.json("graph.json", function(error, j) {
    root=j;
    update();
  });

  function update() {
    var i =0;
    var nodes=flatten(root),
        links=d3.layout.tree().links(nodes);

    // Restart the force layout.
    force
        .nodes(nodes)
        .links(links)
        .start();

    // Update links.
    link=link.data(links, function(d) { return d.target.id; });

    link.exit().remove();

    link.enter().insert("line", ".node")
        .attr("class", function(d) {  if (d.target.isProspect) { return "link1"} else if (d.target.type == "dept") {return "link2"} else  if(d.target.type == "person" || d.target.type == "org"){ return "link"}  })

    // Update nodes.
    node=node.data(nodes, function(d) { return d.id; });

    node.exit().remove();

    var nodeEnter=node.enter().append('g')
        .each(function(d, i) {
          
          var g = d3.select(this); // That's the svg:g we've just created
          
          if(d.type == 'dept' || d.type == "org") {
            g.append('circle')
            .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 20; })
            .style("fill", color);

            g.append("text")
            .attr("dy", ".35em")
            .text(function(d) { if(d.type == "person"){ return d.name } else if (d.type == "dept") { return d.name } else if (d.type == "org") { return d.name} });
          }
          else  if(d.type == "person"){
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
            .attr("xlink:href", function(d){ if(d.img == "male") { return "/img/male.png"} else if(d.img == "female") { return "/img/female.png" } else { return "/img/group.png" }})
            .attr("width", "30px")
            .attr("height", "30px");


          }

        })
        .attr("class", "node")
        .on("click", click)
        .call(force.drag);
             

        // nodeEnter.append("text")
        // .attr("dy", ".35em")
        // .text(function(d) { if(d.name){ return d.name } else if (d.dept) { return d.dept } else if (d.org) { return d.org} else { return d.prospect} });
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
        : d.isProspect = true ? "#BADD82"
        : d._children ? "#092A42"  // collapsed package
        : d.children ? "#c6dbef" // expanded package
        : "#fd8d3c"; // leaf node
  }

  // Toggle children on click.
  function click(d) {
    if (d3.event.defaultPrevented) return; // ignore drag
    if (d.children) {
      d._children=d.children;
      d.children=null;
    } else {
      d.children=d._children;
      d._children=null;
    }
    update();
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