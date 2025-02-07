import { fetchOMID, fetchMetadata, fetchLargeMetadata, metadataMap } from "/static/js/CitationGraph-SPARQL.js";
// import { graph } from "./CitationGraph-d3Graph.js";
import { parseCites, fixSelfCycles, pruneDAG, addChildren } from "./CitationGraph-traverse.js";
import { buildLayout } from "/static/js/CitationGraph-layout.js";
import { graph } from "/static/js/Citation-plot.js"


async function sparqlData() {
    // Steps
    // 1 Get DOI and Top Paper count from interface
    var DOI = document.getElementById("doi").value;
    var depth = 3;
    var ntop = 5;
    console.log(DOI);

    // 2 GET OMID from DOI
    var OMID = (await fetchOMID(DOI).then( r => r.json() )).results.bindings[0].publ_omid.value;
    console.log(OMID);

    // 3 Step down genealogy and collect metadata
    var metadata = metadataMap((await fetchMetadata([OMID]).then(r=>r.json())).results.bindings)[0];

    console.log(metadata);

    var graph = {};
    var rootId = metadata["id"];
    graph[rootId] = metadata;

    var currNodes = [metadata["id"]];
    var fetchedNodes;
    var nextNodes = [];

    for (let i=0; i<depth; i++) {
        for (let nodeId of currNodes) {
            var data = await fetchLargeMetadata(graph[nodeId]["ref_list"]);
            console.log(data);

            fetchedNodes = data.map(di=>metadataMap(di.results.bindings)).flat();
            
            console.log(fetchedNodes);

            fetchedNodes.map(fni => fni["parentIds"].push(nodeId));
            fetchedNodes.forEach(fni => { 
                if (fni["id"] in graph) {
                    if ( fni["id"] != nodeId ){
                        graph[fni["id"]]["parentIds"].push(nodeId);
                    }
                } else {
                    graph[fni["id"]] = fni;
                }
                nextNodes.push(fni["id"]);
            });
        }
        
        currNodes = nextNodes;
        nextNodes = [];
    }

    console.log(graph);

    return rootId;
}

// function drawTree() {
//     d3container.append(graph(data, {label: d=>`${d.data.name} (${d.data.num_cites})`}));
// }


function plotLayout(layout, data) {
    d3container.append(graph(layout, data));
}


var data;

window.addEventListener("load", async () => {
    var rootId = "AuerBKLCI07" // await sparqlData();
    data = await fetch("/static/data/citationGraphInitial.json").then(r => r.json());
    parseCites(data);
    fixSelfCycles(data);
    data = pruneDAG(data, 20);
    console.log(data);
    addChildren(data);
    console.log(data);
    console.log(Object.keys(data));
    var layout = buildLayout(data, rootId);
    console.log(layout);
    // drawTree();
    plotLayout(layout, data);
});