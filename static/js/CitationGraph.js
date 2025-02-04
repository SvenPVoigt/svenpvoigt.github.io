// Functions
// 0 Fetch with retry
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response; // Successfully fetched
        } catch (error) {
            console.error(`Attempt ${i + 1} failed: ${error.message}`);
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw new Error(`Fetch ${url} failed after ${retries} attempts`);
            }
        }
    }
}

// 1 Generate sparql query
function fetchQuery(query) {
    // Clean and encode the query
    const compactQuery = query.replace(/\s+/g, ' ').trim();
    const encodedQuery = encodeURIComponent(compactQuery);
    const endpointQuery = `https://sparql.dblp.org/sparql?query=${encodedQuery}`;

    console.log(endpointQuery);
    
    // Return the fetch promise directly
    return fetchWithRetry(endpointQuery, {}, 3, 2000);
}

// 2 Get OMID from DOI
function fetchOMID(DOI) {
    const query = `
        PREFIX dblp: <https://dblp.org/rdf/schema#>
        SELECT ?publ_omid WHERE {
            ?publ dblp:doi <https://doi.org/${DOI}> .
            ?publ dblp:omid ?publ_omid .
        }
    `;

    return fetchQuery(query);
}

// 3 Get metadata for paper using OMID (title, publication, year, doi, authors, refs)
function fetchMetadata(OMID_list) {
    const query = `
        PREFIX dblp: <https://dblp.org/rdf/schema#>
        PREFIX cito: <http://purl.org/spar/cito/>
        SELECT DISTINCT ?p ?omid ?title ?publication ?year (SAMPLE(?dois) AS ?doi) (GROUP_CONCAT(DISTINCT ?author ; separator="|") AS ?author_list) (GROUP_CONCAT(DISTINCT ?ref ; separator="|") AS ?ref_list) (COUNT(DISTINCT ?cite) AS ?num_cites) WHERE {
            VALUES ?omid { ${OMID_list.map(u=>`<${u}>`).join(" ")} } .
            ?p dblp:omid ?omid .
            ?omid ^cito:hasCitingEntity/cito:hasCitedEntity ?ref .
            ?omid ^cito:hasCitedEntity/cito:hasCitingEntity ?cite .
            
            ?p dblp:title ?title .
            OPTIONAL { ?p dblp:publishedIn ?publication . }
            OPTIONAL { ?p dblp:yearOfPublication ?year . }
            OPTIONAL { ?p dblp:doi ?dois . }
            OPTIONAL { ?p dblp:authoredBy ?author . }
        }
        GROUP BY ?p ?omid ?title ?publication ?year
        ORDER BY DESC(?num_cites)
    `;

    return fetchQuery(query);
}

// 4 Get total genealogy size
function fetchSize(OMID) {
    const query = `
        PREFIX dblp: <https://dblp.org/rdf/schema#>
        PREFIX cito: <http://purl.org/spar/cito/>
        SELECT (COUNT(DISTINCT ?ref) AS ?ref_count)  WHERE {
            ?c cito:hasCitingEntity/(^cito:hasCitedEntity/cito:hasCitingEntity)* <${OMID}> .
            ?c cito:hasCitedEntity ?ref .
            ?c cito:hasCitingEntity/^dblp:omid/dblp:yearOfPublication ?c_year .
            ?c cito:hasCitedEntity/^dblp:omid/dblp:yearOfPublication ?r_year .
            FILTER (?r_year <= ?c_year)
        }
    `;

    return fetchQuery(query);
}

// 5 Collect genealogy with citations using offset and limit
function fetchNTop(OMID, offset, ntop) {
    const query = `
        PREFIX dblp: <https://dblp.org/rdf/schema#>
        PREFIX cito: <http://purl.org/spar/cito/>
        SELECT DISTINCT ?ref_omid (COUNT(DISTINCT ?ref_cite) AS ?num_cites) WHERE {
            {
                SELECT DISTINCT ?ref_omid  WHERE {
                ?c cito:hasCitingEntity/(^cito:hasCitedEntity/cito:hasCitingEntity)* <https://w3id.org/oc/meta/br/06503267503> .
                ?c cito:hasCitedEntity ?ref_omid .
                ?c cito:hasCitingEntity/^dblp:omid/dblp:yearOfPublication ?c_year .
                ?c cito:hasCitedEntity/^dblp:omid/dblp:yearOfPublication ?r_year .
                FILTER (?r_year <= ?c_year)
                }
                OFFSET ${offset}
                LIMIT 200000
            }
            ?ref_omid ^cito:hasCitedEntity/cito:hasCitingEntity ?ref_cite .
        }
        GROUP BY ?ref_omid
        ORDER BY DESC(?num_cites)
        LIMIT ${ntop}
    `;

    return fetchQuery(query);
}

// 6 Get citing works
function fetchCiting(OMID) {
    const query = `
        PREFIX dblp: <https://dblp.org/rdf/schema#>
        PREFIX cito: <http://purl.org/spar/cito/>
        SELECT DISTINCT ?p WHERE {
            <${OMID}> ^cito:hasCitedEntity/cito:hasCitingEntity ?p .
        }
    `;

    return fetchQuery(query);
}

// 7 Check if in path
function fetchIsLinked(OMID_ref, OMID_cite) {
    const query = `
        PREFIX dblp: <https://dblp.org/rdf/schema#>
        PREFIX cito: <http://purl.org/spar/cito/>
        ASK {
            <${OMID_ref}> (^cito:hasCitedEntity/cito:hasCitingEntity)+ <${OMID_cite}> .
        }
    `;

    return fetchQuery(query);
}

// 8 Sleep function
const sleep = m => new Promise(r => setTimeout(r, m))

// 9 Metadata Obj to Metadata key-values
function metadataMap(meta) {
    console.log(meta);
    for (const k in meta) {
        meta[k] = meta[k].value;
    }
    meta["author_list"] = meta["author_list"].split("|");
    meta["ref_list"] = meta["ref_list"].split("|");
}

// 10 rotate array
function rotate(arr) {
    arr = arr.push(arr.shift());
}


window.addEventListener("load", async () => {
    // Steps
    // 1 Get DOI and Top Paper count from interface
    var DOI = document.getElementById("doi").value;
    var ntop = 5;
    console.log(DOI);

    // 2 GET OMID from DOI
    var OMID = (await fetchOMID(DOI).then( r => r.json() )).results.bindings[0].publ_omid.value;
    console.log(OMID);

    // 3 Iterate offsets while less than total size, keeping top x to find citation genealogy top hits
    await sleep(1000);
    var size = parseInt( (await fetchSize(OMID).then( r => r.json() )).results.bindings[0].ref_count.value );
    console.log(size);

    var topPapers = [];
    var queryPromises = [];
    for (let offset = 0; offset < size; offset += 200000) {
        await sleep(2000);
        queryPromises.push( 
            fetchNTop(OMID, offset, ntop)
                .then( r => r.json() )
                .then( data => topPapers.push(...data.results.bindings.map(el => [el.ref_omid.value, parseInt(el.num_cites.value)])))
                .catch( error => console.log(error) )
        );
    }

    const results = await Promise.allSettled(queryPromises);

    console.log(topPapers);

    var topNPapers = topPapers.sort((a, b) => b[1] - a[1]).slice(0,3*ntop).map(el => el[0]);

    console.log(topNPapers);

    // var topNPapers = ['https://w3id.org/oc/meta/br/061202473726', 'https://w3id.org/oc/meta/br/061703605171', 'https://w3id.org/oc/meta/br/06230234710', 'https://w3id.org/oc/meta/br/061603301729', 'https://w3id.org/oc/meta/br/0650349701'];

    // 4 For each paper in collected genealogy collect metadata
    var root = OMID;
    var nodes = {};
    var edges = [];

    var refsInDblp = [];
    var topPapersInDblp = [];

    await fetchMetadata([OMID]).then(r => r.json()).then(data => {metadataMap(data.results.bindings[0]);nodes[root]=data.results.bindings[0];});
    await fetchMetadata(nodes[root]["ref_list"])
        .then(r => r.json() )
        .then( data => {
            for (let b of data.results.bindings) {
                metadataMap(b);
                nodes[b.omid] = b;
                refsInDblp.push(b.omid);
            }
        });
    await fetchMetadata(topNPapers)
        .then(r => r.json() )
        .then( data => {
            var countOfSuccess = 0;
            for (let b of data.results.bindings) {
                metadataMap(b);
                nodes[b.omid] = b;
                topPapersInDblp.push(b.omid);
                countOfSuccess++;
                if (countOfSuccess > ntop) {
                    break;
                }
            }
        });

    console.log(nodes);


    // 5 For each of x top hits, iterate one step down tree and one step up tree, add to path

    for (const refId of refsInDblp) {
        edges.push([root, refId]);
    }

    for (const paper of topPapersInDblp) {
        console.log(nodes[root]["ref_list"]);
        // queryPromises = [];
        for (const refId of refsInDblp) {
            await sleep(500);
            var isLinked = (await fetchIsLinked(paper, refId).then( r => r.json())).boolean;

            console.log(isLinked);

            if (isLinked) {
                edges.push([refId, paper]);
                break;
            }
            // queryPromises.push(
            //     fetchIsLinked(paper, refId)
            //         .then(r => r.json())
            //         .then(data => console.log(data));
            // );
        }
        // await Promise.allSettled(queryPromises);
        rotate(nodes[root]["ref_list"]);
    }

    console.log(nodes);
    console.log(edges);

    // 6 Visualize hierarchy with d3.js
    
});