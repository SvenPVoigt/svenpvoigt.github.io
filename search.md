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
<div> {% include searchbar.html %} </div>
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