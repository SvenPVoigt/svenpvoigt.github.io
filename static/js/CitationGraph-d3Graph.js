// adapted from notebook by https://observablehq.com/user/@fil
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3dag from "https://cdn.skypack.dev/d3-dag@1.0.0-1";

const width = document.getElementById("d3container").offsetWidth;
console.log(width);
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

var dx = 24;
var dy = width/4;

var tree = d3.tree().nodeSize([dx, dy]);
var treeLink = d3.linkHorizontal().x(d => d.y).y(d => d.x);

export function graph(root, {
    label = d => d.data.id, 
    highlight = () => false,
    marginLeft = 40
  } = {}) {
    root = tree(d3.hierarchy(root));
  
    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });
  
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, x1 - x0 + dx * 2])
        .style("overflow", "visible");
    
    const g = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("transform", `translate(${marginLeft},${dx - x0})`);
      
    const link = g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
    .selectAll("path")
      .data(root.links())
      .join("path")
        .attr("stroke", d => highlight(d.source) && highlight(d.target) ? "red" : null)
        .attr("stroke-opacity", d => highlight(d.source) && highlight(d.target) ? 1 : null)
        .attr("d", treeLink);
    
    const node = g.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`);
  
    node.append("circle")
        .attr("fill", d => highlight(d) ? "red" : d.children ? "#555" : "#999")
        .attr("r", 2.5);
  
    node.append("text")
        .attr("fill", d => highlight(d) ? "red" : null)
        .attr("stroke", "white")
        .attr("paint-order", "stroke")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(label);
    
    return svg.node();
  }