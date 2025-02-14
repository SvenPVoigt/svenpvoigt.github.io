// adapted from notebook by https://observablehq.com/user/@fil
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import * as d3dag from "https://cdn.skypack.dev/d3-dag@1.0.0-1";

var width = document.getElementById("d3container").offsetWidth;
console.log(width);
window.addEventListener("resize", () => {width = document.getElementById("d3container").offsetWidth;});

const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 40;
const marginLeft = 40;

var dx = 24;
var dy = width/4;


function stringWrap(str, n) {
    if (!str || n <= 0) {
      return [];
    }
    const result = [];
    for (let i = 0; i < str.length; i += n) {
      result.push(str.slice(i, i + n));//+"-");
    }
    // result[result.length-1] = result[result.length-1].slice(0,-1);
    return result;
  }

export function graph(layout, data) {
    const h = d3.scaleLinear([0, layout.layers.length-1], [marginLeft, width-marginRight]);
    const w = d3.scaleLinear([0, 1], [marginTop, height-marginBottom]);
    var linkMap = d3.linkHorizontal()
        .x(d => {
            // console.log("x", d, layout.nodes[d].d, h(layout.nodes[d].d)); 
            return h(layout.nodes[d].d);
        })
        .y(d => {
            // console.log("y", d, w(layout.nodes[d].w)); 
            return w(layout.nodes[d].w);
        });
  
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible");
    
    const g = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);
      
    const link = g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.8)
      .attr("stroke-width", 4.5)
    .selectAll("path")
      .data(layout.edges)
      .join("path")
        .attr("d", linkMap);
    
    const node = g.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
      .selectAll("g")
      .data(Object.keys(layout.nodes))
      .join("g")
        .attr("transform", d => `translate(${h(layout.nodes[d].d)-4.5},${w(layout.nodes[d].w)-4.5})`);

    const ttBg = g.append("rect")
        .attr("height", "0px")
        .attr("width", "0px")
        .attr("fill", "white")
        .attr("stroke", "#222")
        .attr("stroke-width", "2px")
        .attr("rx", "3px")
        .on("click", (evt) => {
            ttBg.attr("height", "0px")
            .attr("width", "0px");
            ttText.selectAll("tspan").remove();
            ttText.selectAll("a").remove();
        });

    const ttText = g.append("text")
        .attr("font-size", "0.65rem")
        .attr("transform", `translate(5, 5)`);
  
    // node.append("circle")
    //     .attr("fill", d => highlight(d) ? "red" : d.children ? "#555" : "#999")
    //     .attr("r", 2.5);

    node.append("rect")
        .attr("height", "10px")
        .attr("width", "10px")
        .attr("fill", "#555")
        .attr("rx", "3px")
        .on("mouseenter", (evt, d) => {
            ttText.selectAll("tspan").remove();
            ttText.selectAll("a").remove()

            const [mx, my] = d3.pointer(evt);
            var dd = data[d];
            ttText.append("tspan")
                .attr("dy", "1.5em")
                .attr("x", 0)
                .text(`${dd.id} (${dd.year})`);

            for (let titleText of stringWrap(dd.title, 40)) {
                ttText.append("tspan")
                    .attr("dy", "1.5em")
                    .attr("x", 0)
                    .attr("style", "font-style: italic;")
                    .text(`${titleText}`);
            }

            ttText.append("tspan")
                .attr("dy", "1.5em")
                .attr("x", 0)
                .text(`citations: ${dd.num_cites}`);

            ttText.append("tspan")
                .attr("dy", "1.5em")
                .attr("x", 0)
                .text(`publication: ${dd.publication}`);

            ttText.append("a")
                .attr("dy", "1.5em")
                .attr("x", 0)
                // .style("text-decoration", "underline!important")
                // .attr("fill", "blue")
                .attr("href", dd.doi)
                .append("tspan")
                .attr("dy", "1.5em")
                .attr("x", 0)
                .attr("style", "text-decoration: underline!important;")
                .attr("fill", "blue")
                .text(dd.doi.substring(16));

            var bbox = ttText.node().getBBox();

            ttBg.attr("height", `${bbox.height+20}px`)
                .attr("width", `${bbox.width+20}px`);

        });
        // .on("mouseout", () => tooltip.selectAll("text").remove());
  
    node.append("text")
        .attr("font-size", "0.65rem")
        .attr("stroke", "white")
        .attr("stroke-width", "1px")
        .attr("paint-order", "stroke")
        .attr("dy", "-0.1rem")
        .attr("text-anchor", "middle")
        .text(d => d);
        // .attr("fill", d => highlight(d) ? "red" : null)
        // .attr("stroke", "white")
        // .attr("paint-order", "stroke")
        // .attr("dy", "0.31em")
        // .attr("x", d => d.children ? -6 : 6)
        // .attr("text-anchor", d => d.children ? "end" : "start")
        // .text(label);
    
    return svg.node();
  }