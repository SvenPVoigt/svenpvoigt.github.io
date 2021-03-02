---
title: Sort
layout: default
---

Sorting algorithms are common techniques to reduce the number of comparisons needed to sort an array.

<!-- Here I show the bubble sort method which has a worst-case complexity of $$O(n^2)$$.

<div class="gridrow">
<svg id="bubblebarchart" style="width:100%;height:50vh"></svg>
</div> -->

Next I implement merge sort, which has a worst-case complexity of $$O(n\text{log}(n))$$.

<div class="gridrow">
<svg id="orgbarchart" style="width:100%;height:50vh"></svg>
</div>

<div class="gridrow">
<svg id="mergebarchart" style="width:100%;height:50vh"></svg>
</div>

<script src="https://d3js.org/d3.v6.min.js"></script>
<script src="{{ site.baseurl }}/static/js/arraymethods.js"></script>
<script src="{{ site.baseurl }}/static/js/barchart.js"></script>
<!-- <script src="{{ site.baseurl }}/static/js/bubblesort.js"></script> -->
<script src="{{ site.baseurl }}/static/js/mergesort.js"></script>
