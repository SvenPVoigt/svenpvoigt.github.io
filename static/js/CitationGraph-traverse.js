export function parseCites(data) {
    for (let id in data) {
        data[id]["num_cites"] = parseInt(data[id]["num_cites"]);
    }
}

export function fixSelfCycles(data) {
    for (let id in data) {
        data[id]["parentIds"] = data[id]["parentIds"].filter(parentId => parentId != id);
    }
}

export function addChildren(data) {
    for (let k in data) {
        data[k]["children"] = new Set();
    }
    for (let k in data) {
        console.log(k);
        data[k]["parentIds"].forEach(parentId => {
            if (parentId in data) {
                data[parentId]["children"].add(k);
            }
        });
    }
}

function getTopCites(data, n) {
    var ids = Object.keys(data).slice();
    console.log(ids);
    
    ids.sort( (a,b) => data[b]["num_cites"] - data[a]["num_cites"]);

    return ids.slice(0,n);
}

var idsVisited = new Set();

function collectReachableIds(data, id, idSet) {
    idsVisited.add(id);
    data[id]["parentIds"].forEach(parentId => {
        if (!idsVisited.has(parentId)) {
            idSet.add(parentId);
            idSet = idSet.union(collectReachableIds(data, parentId, idSet));
        }
    });

    return idSet;
}

export function pruneDAG(data, n) {
    console.log(data);
    var topCitedIds = getTopCites(data, n);
    var idsReached = new Set();

    for (let id of topCitedIds) {
        idsReached = idsReached.union(collectReachableIds(data, id, idsReached));
    }


    var newData = {};

    for (let id of idsReached) {
        newData[id] = data[id];
    }

    return newData;
}