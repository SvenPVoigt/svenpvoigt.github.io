---
title: Home
description: Know when to walk away, know when to run
category: Tutorial
layout: default
array:
  - one
  - two
---

<div class="cardrack container">
  {% for c in site.collections %}
  {% if c.label != "posts" %}
  <a class="card shadow" href="/{{c.label}}/">
    <p class="headerp">{{ c.label }}</p>
    <p class="padded" style="text-align: justify;"> {{ c.description }} </p>
  </a>
  {% endif %}
  {% endfor %}
</div>