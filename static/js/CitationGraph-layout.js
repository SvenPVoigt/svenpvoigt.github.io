const avg = array => array.reduce((a, b) => a + b) / array.length;


function computeDepth(data, nodeId, d, layout) {
    if (nodeId in layout["nodes"]) {
        return;
    }
    layout["nodes"][nodeId] = {};
    layout["nodes"][nodeId]["d"] = d;

    if (d+1 > layout["layers"].length) {
        layout["layers"].push(new Set());
    }
    layout["layers"][d].add(nodeId);


    for (let childId of data[nodeId]["children"]) {
        computeDepth(data, childId, d+1, layout);
    }

    return;
}



function computeWidth(data, root, layout) {
    layout["nodes"][root]["w"] = 0.5;

    var parentWidths = [];
    var layer;

    for (let i=1; i<layout.layers.length; i++) {
        layer = Array.from(layout["layers"][i]);

        for (let nodeId of layer) {
            parentWidths.push( avg( data[nodeId]["parentIds"].map(parentId=> { 
                if(parentId in layout["nodes"]) {
                    layout.edges.push([parentId, nodeId]);
                    return layout["nodes"][parentId].w; 
                }
            } ) ) );
        }

        layer = layer.map( (val, idx) => [val, idx] );
        layer.sort( (a,b) => parentWidths[b] );
        var len = layer.length;
        layer.forEach( (val,idx) => {
            layout["nodes"][val[0]]["w"] = idx/(len-1);
        });

    }
}


export function buildLayout(data, root) {
    var layout = { nodes: {}, layers: [], edges: [] };

    computeDepth(data, root, 0, layout);
    computeWidth(data, root, layout);

    return layout;
}