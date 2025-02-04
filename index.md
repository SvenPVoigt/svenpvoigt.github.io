---
title: Homepage
layout: main
stylesheet: index
script: index
---

<div id="homepageLayout" class="fullSize mainLayer">




<div id="headContent" class="dark">
    <div id="headLogo">
        <!-- <img src="/static/images/icon.svg" style="width:4rem;"> -->
    </div>
    <div id="headTitle">
        <a href="/about"><h1>Sven Voigt</h1></a>
    </div>
</div>




<div id="barContent" class="light">

<div id="barFilters">
<p id="barFilterTitle">filters</p>
{% assign filterList = "article,tutorial" | split: "," %}
{% for filter in filterList %}
<div class="filter" onclick='this.classList.toggle("clicked");'>{{filter}}</div>
{% endfor %}
</div>


<div>
</div>


<div id="barSiteLinks">
    <a href="/about">About</a>
    <!-- <a href="/sitemap">Site Map</a> -->
    <a href="/privacypolicy">Privacy Policy</a>
    <!-- <a href="https://twitter.com/svenpvoigt" class="fa fa-twitter" data-show-count="false"></a> -->
    <a href="#" id="copyright">2025 &#169;</a>
</div>

</div>




<div id="articleContent">

<div id="articleList">
{% for page in site.pages %}
{% if page.title and page.date and page.description %}
<a href="{{page.url}}">
<div class="articleCard" data-url="{{page.url}}" onclick="loadArticle(this)">
<div class="articleDate">{{page.date}}</div>
<div class="articleTitle">{{page.title}}</div>
<div class="articleDescription">{{page.description}}</div>
</div>
</a>
{% endif %}
{% endfor %}
</div>

</div>




</div>







<iframe id="appPane" class="fullsize hidden foreground">
<iframe>