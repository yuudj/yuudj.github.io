---
title: Series
icon: fas fa-book
order: 4
---

{% assign series = site.posts | where: "is_series", true | group_by: "series_title"%}

{% for serie in series %}

<h4 class="text-success p-0">{{ serie.name | upcase }}</h4>
  {% assign posts = site.posts | where: "is_series", true | where: "series_title", serie.name | sort: 'date' %}
<ul class="list-group">
  {% for post in posts %}
  <li class="list-group-item d-flex justify-content-between align-items-center"><a class="" href="{{ post.url }}">{{ post.title }} <span class="badge badge-primary badge-pill">{{post.date | date: "%Y - %m - %-d" }}</span></a></li>
  {% endfor %}
</ul>



{% endfor %}