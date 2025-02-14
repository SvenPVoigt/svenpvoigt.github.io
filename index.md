---
title: Homepage
layout: main
stylesheet: index
script: index
---

<div id="homepageLayout">


<div id="about" class="homepageCard">
<a href="/about/"><h2>About</h2></a>
{% assign about-page = site.pages | where: "path", "about.md" | first %}
{{ about-page.content }}
</div>

<div id="blog" class="homepageCard">
<a href="/blog/"><h2>Blog</h2></a>
<div class="cardDisplay">
{% assign sorted-blogs = site.categories.blog | sort: "date" | reverse %}
{% for blog in sorted-blogs %}
<a href="{{blog.url}}">
<div class="blogCard">
{% if blog.thumbnail %}
<img class="blogThumbnail" src="/static/images/thumbnails/{{blog.thumbnail}}"/>
{% else %}
<img class="blogThumbnail" src="/static/images/thumbnails/missing.svg"/>
{% endif %}
<h3 class="blogTitle">{{blog.title}}</h3>
<p class="blogDescription">{{blog.description}}</p>
</div>
</a>
{% endfor %}
</div>
</div>

<div id="publications" class="homepageCard cardList">
<a href="/publications/"><h2>Publications</h2></a>
{% assign publications-page = site.pages | where: "path", "publications.md" | first %}
{% for paper in publications-page.papers limit:4 %}
<div class="publicationCard">
<div class="publicationTitle">
{{paper.title}}
{% for link in paper.links %}
<a href="{{link.url}}" class="{{link.icon}} linkSpaced" data-show-count="false"></a>
{% endfor %}
</div>
<div class="publicationJournal">{{paper.journal}}, {{paper.year}}</div>
<div class="publicationAuthors">
    {% for author in paper.authors %}
    {{author.name}}{% if forloop.last %}{% else %}, {% endif %}
    {% endfor %}
</div>
</div>
{% endfor %}
<a href="/publications/">more >></a>>
</div>

<!-- <div id="awards" class="homepageCard">
<a href="/awards/"><h2>Awards</h2></a>
{% assign awards-page = site.pages | where: "path", "awards.md" | first %}
{{ awards-page.content }}
</div> -->

<!-- <div id="news" class="homepageCard">
<a href="/news/"><h2>News</h2></a>
</div>

<div id="openSource" class="homepageCard">
<a href="/openSource/"><h2>Open Source Projects</h2></a>
</div>

<div id="tutorials" class="homepageCard">
<a href="/tutorials/"><h2>Tutorials</h2></a>
</div> -->


</div>