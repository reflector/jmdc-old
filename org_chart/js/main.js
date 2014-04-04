var width=900,
      height=560,
      root;

  var force=d3.layout.force()
      .linkDistance(65)
      .charge(-460)
      .chargeDistance([1000])
      .gravity(.04)
      .size([width, height])
      .on("tick", tick);

  var svg=d3.select(".force_layout").append("svg")
      .attr("width", width)
      .attr("height", height);

  var link=svg.selectAll(".link"),
      node=svg.selectAll(".node");

  d3.json("graph.json", function(error, j) {
    root=j;
    update();
  });

  function update() {
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
        .attr("class", function(d) { if(d.target.name || d.target.org){ return "link"} else if(d.target.dept) {return "link2"} else { return "link1"} })
        

    // Update nodes.
    node=node.data(nodes, function(d) { return d.id; });

    node.exit().remove();

    var nodeEnter=node.enter().append("g")
        .attr("class", "node")
        .on("click", click)
        .call(force.drag);

    nodeEnter.append("circle")
        .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 20; })

    nodeEnter.append("text")
        .attr("dy", ".35em")
        .text(function(d) { if(d.name){ return d.name } else if (d.dept) { return d.dept } else if (d.org) { return d.org} else { return d.prospect} });

    node.select("text")
        .style("font-style", function(d) { if(d.name){ return "normal" } else { return "italic" }});

    node.select("circle")
        .style("fill", color);

  }

  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }

  function color(d) {
    return d.org ? "#F0740F" 
        : d.dept ? "#3182bd"
        : d.name ? "#BADD82"
        : d.prospect ? "#BADD82"
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