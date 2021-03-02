---
title: Home
description: Know when to walk away, know when to run
category: Tutorial
layout: goat
array:
  - one
  - two
---

<div class="cardrack container">
  {% for c in site.collections %}
  {% if c.label != "posts" %}
  <div class="card">
    <p class="headerp">{{ c.label }}</p>
    <p>additional info</p>
  </div>
  {% endif %}
  {% endfor %}
</div>