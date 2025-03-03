---
layout: blog
thumbnail: Citation-Graph.png
script: CitationGraph
description: >-
    Using the SPARQL query language, this article examines how we can use knowledge graphs to make data-driven decisions. 
    A graph query is used to find a history of references for a paper and then additional graph queries for each reference find the number of citations per reference.
    A citation graph is formed from top cited papers and visualized with D3. Readers can enter custom DOIs.
---


## The excitement of expanding our knowledge base meets the tedious process of researching papers

When broadening our horizons and familiarizing ourselves with a new field or new method, we as researchers face the task of reading research papers and learning the background information needed to explain the complex terminology being used. However, many times, papers focus on implementing incremental changes to existing methods and leave explanation of the existing methods to the references. Unfortunately, there are usually a lot of references and some of these may not be the original, more complete explanation. Perhaps this has led you to a similar problem as myself, where you spend a significant amount of time searching for references in references of references and so on through a chain of references to find a more complete explanation of a concept. Essentially performing a graph search manually.


## Let's speed up the process using graph queries

Luckily, there are databases of citations available online- a useful one with lots of metadata attributes and a published schema is [dblp], an open database of publications on computer science. And [dblp] recently launched a beta version of a [knowledge graph tool](https://sparql.dblp.org/). So now we can perform graph queries over citations automatically!


## Citation graph strategy

However, there are usually lots of references to look through. So we need a strategy for searching through the references. There are lots of approaches, such as filtering on keywords or titles. However, since we are focusing on a broad exploration of a new field, this article takes a look at using top cited papers, which are probably both original (explain methods/techniques from bottom up) and commonly used as background information in other works.


## SPARQL query for references

SPARQL graph queries work for a particular graph model called the resource description framework (RDF). In this graph, each node has a unique identifier (called an IRI) and reuses types of edges (also identified by IRIs) to link the nodes together. Together, these form triples of subject-predicate-object elements, where subject and object are nodes and predicates are types of edges. 

A big benefit of IRIs is that they allow distributing data across a network and achieve uniqueness with namespaces. When referencing an IRI, an absolute IRI can be used in angle brackets `<https://example.com>`{:.language-html} where the whole namespace is written out. Or relative IRIs can be used by declaring namespaces at the beginning of a SPARQL query using prefix commands. Variables are defined with `?v` and are used to search a knowledge graph for all nodes where the IRIs match.

Then lastly, we need to know the schema of a knowledge graph to be able to search it. In [dblp] we use a 


```sparql
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
```


## SPARQL query for citations


## SPARQL graph search limitations


## Citation graph query

## D3 visualization

## DOI to Citation graph tool

<label for="doi">DOI:</label>
<input id="doi" type="text" size="50" value="10.1007/978-3-540-76298-0_52"/>

<div id="d3container"></div>

















[dblp]: https://dblp.org/