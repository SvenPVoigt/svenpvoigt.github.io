---
title: Homepage
layout: main
---

<div class="mainDiv" style="z-index:0;">
    <div id="main-top90" style="height:90vh; width:100vw;">
        <div style="justify-content:space-around; align-content: center;">
            <div class="nav transparentFloat">
                <h1 class="LightText">SVEN VOIGT</h1>
                {% include collections.html %}
            </div>
        </div>
    </div>
    <div class="footerDiv" id="main-bottom10" style="height:10vh; width:100vw;">
    
            {% include footer.html %}
    
    </div>
</div>
<div class="mainDiv darkBG" style="z-index:-1; grid-template-columns: repeat(25, 4vw);">
    {% for i in (1..500) %}
    <div id="block{{i}}" style="height: 4vw; width: 4vw;"></div>
    {% endfor %}
</div>