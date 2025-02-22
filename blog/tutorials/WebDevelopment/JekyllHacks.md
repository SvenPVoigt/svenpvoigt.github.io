---
layout: tutorial
title: Jekyll Hacks
description: Hack Jekyll. Blog better.
date: 2025-01-01
---

## These aren't really jekyll hacks as much as they are boiler plate that I copy/paste

All pages: `site.pages`

page.content

The content of the Page, rendered or un-rendered depending upon what Liquid is being processed and what page is.

page.title

The title of the Page or Document resource.

page.excerpt

The un-rendered excerpt of a Page or Document. Can be overridden in the front matter. It can either be disabled atomically for certain page or document by setting an empty string to an excerpt_separator key in the front matter of desired resource or disabled site-wide by setting the same as a top-level key in the config file.

page.url

The URL of the Post without the domain, but with a leading slash, e.g. /2008/12/14/my-post.html

page.date

The Date assigned to the Post. This can be overridden in a Post's front matter by specifying a new date/time in the format YYYY-MM-DD HH:MM:SS (assuming UTC), or YYYY-MM-DD HH:MM:SS +/-TTTT (to specify a time zone using an offset from UTC. e.g. 2008-12-14 10:30:00 +0900). Not applicable to Pages.

page.id

An identifier unique to a document in a Collection or a Post (useful in RSS feeds). e.g. /2008/12/14/my-post/my-collection/my-document. Not applicable to Pages.

page.categories

The list of categories to which this post belongs. Categories are derived from the directory structure above the _posts directory. For example, a post at /work/code/_posts/2008-12-24-closures.md would have this field set to ['work', 'code']. These can also be specified in the front matter. Note: Path-based categories may not work for documents in user-defined collections.

page.collection

The label of the collection to which a Document belongs. e.g. posts for a post, or puppies for a document at path _puppies/rover.md. If not part of a collection, an empty string is returned.

page.tags

The list of tags to which this post belongs. These can be specified in the front matter.

page.dir

The path between the source directory and the file of a page, e.g. /pages/ when the page is at path pages/about.md relative to the source directory. This is derived from the url attribute of the page and can therefore be overridden via the permalink key in the front matter. NOTE: This variable is not applicable to posts and documents in user-defined collections. Use the categories variable to get similar info for posts.

page.name

The filename of the post or page, e.g. about.md

page.path

The path to the raw post or page, relative to the source directory. Example usage: Using a combination of the repository's blob URL and this page variable to get the full URL to the file in the repository. This can be overridden in the front matter.

page.slug

The filename of a Document resource without its extension (or date prefixes for a post). For example, slug for a post at URL /2017/02/22/my-new-post.html, would be my-new-post. Can be overridden in the front matter.

page.ext

The file extension of a Document resource. For example, .html. Can be overridden in the front matter.

page.next

The next post relative to the position of the current post in site.posts. Returns nil for the last entry.

page.previous

The previous post relative to the position of the current post in site.posts. Returns nil for the first entry.








# Collections

## Exploring collections

```html
{% for post in site.posts["algorithms"] %}
  <a href="{{ a.url }}">{{ a.title }}</a>
{% endfor %}
```

collections at `site.collections`



site.documents

A list of all the documents in every collection.

site.categories.CATEGORY

The list of all Posts in category CATEGORY.

site.tags.TAG

The list of all Posts with tag TAG.


site.url



# Examples

## HTML Includes

### Categories

```html
{% assign collection = page.collection %}

{% assign all_categories = site.pages | where_exp: "item", "item.categories contains page.collection" %}

<div class="card overflow">
{{ collection }} <br>
{{ site.pages | map: "url"}} <br>
{{ site.posts | map: "url"}} <br>
{{ site.pages | map: "categories"}} <br>
{{ site.posts | map: "categories"}} <br>
{{ all_categories }}
</div>


{% for category in all_categories %}

<div class="card shadow highlighter">
  <a class="sitenav container vmiddle card padded" href="/{{page.collection}}/feed?{{category}}">
    <div> 
      {{ category }}
    </div>
  </a>
</div>

{% endfor %}
```


### Collections

```html
{% assign labels = "blog,projects,tutorials,polls" | split: "," %}


{% for lab in labels %}

<a id="link-{{lab}}" class="navlink LightText" style="font-size: 3vw;" href="/{{ lab }}/">
<div style="justify-content: space-around;">
    <div style="font-size: 5vh;">{{ lab }}</div>
</div>
</a>

{% endfor %}
```

### Footer

```html
<div class="nav left-right" style="height:10vh;">
    <a itemscope href="/">
        Home
        <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://svenpvoigt.github.io",
                "name": "The personal website of Sven",
                "author": {
                    "@type": "Person",
                    "name": "Sven Voigt"
                }
            }
        </script>
    </a>
    <a href="/about">About</a>
    <a href="/sitemap">Site Map</a>
    <a href="/privacypolicy">Privacy Policy</a>
    <a href="https://twitter.com/svenpvoigt" class="fa fa-twitter" data-show-count="false"></a>
    <a href="#" id="copyright">&#169;</a>
</div>

<script>
    var copyright = document.getElementById("copyright");
    copyright.innerHTML = `${new Date().getFullYear()} &#169;`;
</script>
```

### Header

```html
<div class="backgroundlight gridfill" style="grid-template-columns: auto auto">
  <div class="menubar">
    <a id="show" onclick="showoverlay()">
      <svg class="button" viewBox="0 0 18 15" width="18px" height="15px">
                  <path fill="#fff" d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.032C17.335,0,18,0.665,18,1.484L18,1.484z M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.032C17.335,6.031,18,6.696,18,7.516L18,7.516z M18,13.516C18,14.335,17.335,15,16.516,15H1.484 C0.665,15,0,14.335,0,13.516l0,0c0-0.82,0.665-1.483,1.484-1.483h15.032C17.335,12.031,18,12.695,18,13.516L18,13.516z"/>
      </svg>
    </a>
  </div>
  <div style="font-size:1.5em; font-weight:bold; color:#fff; margin:2vw;">Sven Voigt</div>
</div>

<div id="menuoverlay" class="overlay">
  <div id="close" onclick="closeoverlay()">
    <svg class="button" viewBox="0 0 18 15" width="18px" height="15px">
                <path onclick="showoverlay()" fill="#ddd" d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.032C17.335,0,18,0.665,18,1.484L18,1.484z M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.032C17.335,6.031,18,6.696,18,7.516L18,7.516z M18,13.516C18,14.335,17.335,15,16.516,15H1.484 C0.665,15,0,14.335,0,13.516l0,0c0-0.82,0.665-1.483,1.484-1.483h15.032C17.335,12.031,18,12.695,18,13.516L18,13.516z"/>
    </svg>
  </div>
  <div style="height:5vh;"></div>
  <div class="verticallinks">
    {% for page in site.pages %}
      {% if page.title=="Home" %}
        <a class="home" href="{{ site.baseurl }}{{ page.url }}">{{page.title}}</a>
      {% endif %}
    {% endfor %}
    {% for page in site.pages %}
      {% if page.title!="Home" and page.title %}
        <a class="headerlink" href="{{ site.baseurl }}{{ page.url }}">{{page.title}}</a>
      {% endif %}
    {% endfor %}
  </div>
</div>


<script>
  menu = document.getElementById("menuoverlay");
  console.log(menu);

  function showoverlay() {
    menu.style.display = "block";
  }

  function closeoverlay() {
    menu.style.display = "none";
  }
</script>
```

### Search

```html
---
title: Home
description: Know when to walk away, know when to run
category: Tutorial
layout: goat
array:
  - one
  - two
---

<div class="container">
<div class="cardrack container overflow">
  {% for c in site.collections %}
  {% if c.label != "posts" %}
  <a class="card shadow" href="/{{c.label}}/">
    <p class="headerp">{{ c.label }}</p>
    <p class="padded" style="text-align: justify;"> {{ c.description }} </p>
  </a>
  {% endif %}
  {% endfor %}
</div>
</div>
```

### Searchbar

```html
<!-- The following div is to center the searchbar -->
<div class="container padded" style="align-content: center; justify-content: center;">

    <form class="padded" action="/search" method="get" style="text-align: center;">
        <input type="text" style="font-size: 30px; border-radius: 30px; box-shadow: none;" id="search" name="search">
        <input type="submit" style="font-size: 30px; border-radius: 5px;" value="Search">
    </form>

    <script>
        var data = null;
    </script>

</div>
```

## HTML Animations

### Blinking checkered tests

```html
---
title: Tests
description: Testing different html, css, and js functionality
---

<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Metadata Values --> 
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="{{site.description}} {{page.description}}" />

    <title>{{site.title}} - {{page.title}}</title>

    <!-- Stylesheets -->
    <style>
        @keyframes blink {
            0% {
                background-color: blue;
            }
            5% {
                background-color: white;
            }
            100% {
                background-color: blue;
            }
        }

        div {
            display: grid;
        }

        #block1 {
            animation: blink 2s ease 0s infinite;
        }

        #block2 {
            animation: blink 2s ease 1s infinite;
        }

        #block3 {
            animation: blink 2s ease 2s infinite;
        }

        #block4 {
            animation: blink 2s ease 3s infinite;
        }

        #block11 {
            border-right: 3px solid aqua;
            border-bottom: 3px solid aqua;
            margin: -1.5px;
        }

        #block21 {
            border-right: 3px solid aqua;
            border-top: 3px solid aqua;
            margin: -1.5px;
        }
    </style>
</head>

<body>
    <div class="mainDiv" style="z-index:1;"></div>
    <div class="mainDiv" style="display: grid; z-index:-1; grid-template-columns: repeat(10, 10vw); grid-gap: 0px 0px;">
    {% for i in (1..100) %}
        <div id="block{{i}}" style="height: 10vw; width: 10vw;"></div>
    {% endfor %}
    </div>
</body>

</html>
```

## Sass animations

### Background checkered lightning

```scss
---
---


@keyframes blink {
    0% {
        background-color: rgb(54, 181, 255);
    }
    2% {
        background-color: rgb(6, 6, 53);
    }
}


@keyframes lightup {
    0% {
        border-left: 3px solid rgba(54, 181, 255, 1);
        border-top: 3px solid rgba(54, 181, 255, 0);
        border-right: 3px solid rgba(54, 181, 255, 0);
        border-bottom: 3px solid rgba(54, 181, 255, 0);
    }
    5% {
        border-left: 3px solid rgba(54, 181, 255, 0.65);
        border-top: 3px solid rgba(54, 181, 255, 1);
        border-right: 3px solid rgba(54, 181, 255, 0);
        border-bottom: 3px solid rgba(54, 181, 255, 0);
    }
    10% {
        border-left: 3px solid rgba(54, 181, 255, 0.25);
        border-top: 3px solid rgba(54, 181, 255, 0.65);
        border-right: 3px solid rgba(54, 181, 255, 1);
        border-bottom: 3px solid rgba(54, 181, 255, 0);
    }
    15% {
        border-left: 3px solid rgba(54, 181, 255, 0);
        border-top: 3px solid rgba(54, 181, 255, 0.25);
        border-right: 3px solid rgba(54, 181, 255, 0.65);
        border-bottom: 3px solid rgba(54, 181, 255, 1);
    }
    20% {
        border-left: 3px solid rgba(54, 181, 255, 0);
        border-top: 3px solid rgba(54, 181, 255, 0);
        border-right: 3px solid rgba(54, 181, 255, 0.25);
        border-bottom: 3px solid rgba(54, 181, 255, 0.65);
    }
    25% {
        border-left: 3px solid rgba(54, 181, 255, 0);
        border-top: 3px solid rgba(54, 181, 255, 0);
        border-right: 3px solid rgba(54, 181, 255, 0);
        border-bottom: 3px solid rgba(54, 181, 255, 0.25);
    }
}


$dir: normal, reverse;

@for $i from 1 through 500 {
    $animationDuration: random(3) + 1.5;
    $animationDelay: random(1000) / 50;
    $animationDelay2: random(20000) / 50;

    #{"#block" + $i} {
        background-color: rgb(6, 6, 53);
        transform: rotate( #{random(4)*90 + deg} );
        margin: -1.5px;
        border-left: 3px solid rgba(54, 181, 255, 0);
        border-top: 3px solid rgba(54, 181, 255, 0);
        border-right: 3px solid rgba(54, 181, 255, 0);
        border-bottom: 3px solid rgba(54, 181, 255, 0);
        animation: 
            lightup #{$animationDuration + "s"} linear #{$animationDelay + "s"} infinite nth($dir, random(2)),
            blink #{$animationDuration*20 + "s"} ease #{$animationDelay2 + "s"} infinite normal;
    }

}

```

### Orbs

```scss
@mixin dots($count) {
    $text-shadow: ();
    @for $i from 0 through $count {
      $text-shadow: $text-shadow,
                   (-.5+(random()) * 3) + em
                   (-.5+(random()) * 3) + em
                   7px
                   hsla(random() * 360, 100%, 50%,.9);
    }
    text-shadow: $text-shadow;
  }
  
  html {
    font: 5vmin/1.3 Serif;
    overflow: hidden;
    background: #123;
  }
  
  body, head {
    display: block;
    font-size: 52px;
    color: transparent;
  }
  
  head::before, head::after,
  body::before, body::after {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 3em;
    height: 3em;
    content: '.';
    mix-blend-mode: screen;
    animation: 44s -27s move infinite ease-in-out alternate;
  }
  
  
  body::before {
    @include dots(40);
    animation-duration: 44s;
    animation-delay: -27s;
  }
  
  body::after {
    @include dots(40);
    animation-duration: 43s;
    animation-delay: -32s;
  }
  
  head::before {
    @include dots(40);
    animation-duration: 42s;
    animation-delay: -23s;
  }
  
  head::after {
    @include dots(40);
    animation-duration: 41s;
    animation-delay: -19s;
  }
  
  
  @keyframes move {
    from {
      transform: rotate(0deg) scale(12) translateX(-20px);
    }
    to {
      transform: rotate(360deg) scale(18) translateX(20px);
    }
  }
```

```scss
```
