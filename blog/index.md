---
layout: main
title: Blog Overview
description: Describes the purpose of my blog and shows the categories of posts and most recent posts.
---


<div class="footerDiv footerOverlay">
{% include footer.html %}
</div>
<div class="mainDiv left-right" style="z-index:0; grid-template-columns: 1fr 1fr; gap: 0px;">
    <div class="TitlePlusContent"  style="background-color: rgb(255,230,255);">
        <div><h1 id="categoriesTitle" class="Title DarkText">Categories</h1></div>
        <div class="centeredDiv" style="grid-template-columns: 1fr 1fr; grid-gap: 5vh; width: 100%; height: 100%;">
            <a id="card1" class="DarkCard" href="/blog/science">
                Science
            </a>
            <a id="card2" class="DarkCard" href="/blog/environment">
                Environment
            </a>
            <a id="card3" class="DarkCard" href="/blog/travel">
                Travel
            </a>
            <a id="card4" class="DarkCard" href="/blog/economics">
                Economics
            </a>
        </div>
    </div>
    <div class="TitlePlusContent"  style="background-color: rgb(230,255,230);">
        <div><h1 id="recentPostsTitle" class="Title DarkText">Recent Posts</h1></div>
        <div class="List">
            {% assign blogPosts = site.posts | where_exp: "item", "item.categories contains 'blog'" %}
            {% for post in blogPosts %}
                <a href="{{post.url}}">{{post.title}}</a>
            {% endfor %}
        </div>
    </div>
</div>