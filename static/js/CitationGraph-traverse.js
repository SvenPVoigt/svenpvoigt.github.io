export function parseCites(data) {
    for (let id in data) {
        data[id]["num_cites"] = parseInt(data[id]["num_cites"]);
    }
}

export function fixCycles(data) {
    for (let id in data) {
        data[id]["parentIds"] = data[id]["parentIds"].filter(parentId => parentId != id);
    }
}

function getTopCites(data, n) {
    var ids = Object.keys(data).slice();
    console.log(ids);
    
    ids.sort( (a,b) => data[b]["num_cites"] - data[a]["num_cites"]);

    return ids.slice(0,n);
}

function idsReached(data, id, idSet) {
    console.log(data);
    console.log(id);
    data[id]["parentIds"].forEach(parentId => {
        idSet.add(parentId);
        idSet = idSet.union(idsReached(data, parentId, idSet));
    });

    return idSet;
}

export function pruneDAG(data, n) {
    console.log(data);
    var topCitedIds = getTopCites(data, n);
    var idSet = new Set();

    for (let id of topCitedIds) {
        idSet = idSet.union(idsReached(data, id, idSet));
    }


    var newData = {};

    for (let id of idSet) {
        newData[id] = data[id];
    }

    return newData;
}