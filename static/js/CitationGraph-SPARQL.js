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
    // return fetchWithRetry(endpointQuery, {}, 3, 2000);
    return fetch(endpointQuery);
}

// 2 Get OMID from DOI
export function fetchOMID(DOI) {
    const query = `
        PREFIX dblp: <https://dblp.org/rdf/schema#>
        SELECT ?publ_omid WHERE {
            ?publ dblp:doi <https://doi.org/${DOI}> .
            ?publ dblp:omid ?publ_omid .
        }
    `;

    return fetchQuery(query);
}

// 3 Get metadata for paper using OMID (dblp_id, omid, title, publication, year, doi, authors, refs, cite_count)
export function fetchMetadata(OMID_list) {
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

// 4 Repeat fetch multiple times
export async function fetchLargeMetadata(OMID_list) {
    var queryPromises = [];
    var OMID_list_slice;
    const delta = 10
    for (let x=0; x<OMID_list.length; x+=delta) {
        await sleep(2000);
        OMID_list_slice = OMID_list.slice(x, x+delta);
        queryPromises.push( 
            fetchMetadata(OMID_list_slice)
                .then( r => r.json() )
                .catch( error => console.log(error) )
        );
    }
    const results = await Promise.allSettled(queryPromises);
    return results.map(el => el.value).flat();
}

// 8 Sleep function
const sleep = m => new Promise(r => setTimeout(r, m))

// 9 Metadata Obj to Metadata key-values
export function metadataMap(meta_list) {
    for (const meta of meta_list) {
        // console.log(meta);
        for (const k in meta) {
            meta[k] = meta[k].value;
        }
        meta["author_list"] = meta["author_list"].split("|");
        meta["ref_list"] = meta["ref_list"].split("|");
        meta["id"] = meta["p"].substring(meta["p"].lastIndexOf('/') + 1);
        meta["parentIds"] = [];
    }
    return meta_list;
}

// 10 rotate array
function rotate(arr) {
    arr = arr.push(arr.shift());
}