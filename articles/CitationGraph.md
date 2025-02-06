---
layout: tutorial
title: Citation Graph
description: Identifying the entire history of references of references in a paper to find the most highly cited works in the entire citation genealogy.
date: 2025-02-01
script: CitationGraph
---


# .

How often have you found yourself searching through the references of a paper to find the more original works that explain the basis of what is going on the paper you are reading? Or are you simply trying to broaden your horizons and see what the notable related works are?

Perhaps this has led you to a similar problem as myself, where you spend a significant amount of time searching for references in references of references and so on. Essentially performing a graph search manually. Well I just found that dblp, an open database of publications on computer science (by Universität Trier), has launched a beta version of a graph search tool. This tool exposes a SPARQL endpoint, allowing us to perform graph queries over a knowledge graph of publications. All we need is a starting point and then a limit on how many articles to retrieve. We will order the articles by how many citations they have.

# .

## A quick search

<label for="doi">DOI:</label>
<input id="doi" type="text" size="50" value="10.1007/978-3-540-76298-0_52"/>

<div id="d3container"></div>