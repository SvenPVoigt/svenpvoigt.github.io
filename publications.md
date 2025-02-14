---
title: Publications
layout: list
papers:
    # -
    #     title: Materials Informatics Knowledge Graph.
    #     year: 2024
    #     journal: Dissertation
    #     authors: 
    #         -
    #             name: Sven P. Voigt
    -
        title: Illustrating an Effective Workflow for Accelerated Materials Discovery.
        year: 2024
        journal: IMMI
        authors:
            -
                name: Mrinalini Mulukutlaa
            -
                name: A. Nicole Persona
            -
                name: Sven P. Voigt
            -
                name: Lindsey Kuettner
            -
                name: Branden Kappes
            -
                name: Danial Khatamsaz
            -
                name: Robert Robinson
            -
                name: Daniel Salas
            -
                name: Wenle Xu
            -
                name: Daniel Lewis
            -
                name: Hongkyu Eoh
            -
                name: Kailu Xiao
            -
                name: Haoren Wang
            -
                name: Jaskaran Singh Saini
            -
                name: Raj Mahat
            -
                name: Trevor Hastings
            -
                name: Matthew Skokan
            -
                name: Vahid Attari
            -
                name: Michael Elverud
            -
                name: James D. Paramore
            -
                name: Brady Butler
            -
                name: Kenneth Vecchio
            -
                name: Surya R. Kalidindi
            -
                name: Douglas Allaire
            -
                name: Ibrahim Karaman
            -
                name: Edwin L. Thomas
            -
                name: George Pharr
            -
                name: Ankit Srivastava
            -
                name: Raymundo Arróyave
        links:
            -
                icon: "ai ai-doi"
                url: "https://doi.org/10.1007/s40192-024-00357-3"
    -
        title: "In Situ Transmission Electron Microscopy: Signal Processing Challenges and Examples."
        year: 2022
        journal: IEEE Signal Processing
        authors:
            -
                name: Josh Kacher
            -
                name: Yao Xie
            -
                name: Sven P. Voigt
            -
                name: Shixiang Zhu
            -
                name: Henry Yuchi
            -
                name: Jordan Key
            -
                name: Surya R. Kalidindi

        links:
            -
                icon: "fa-solid fa-file-pdf"
                url: "https://par.nsf.gov/servlets/purl/10339314"
            -
                icon: "ai ai-doi"
                url: "https://doi.org/10.1109/MSP.2021.3119284"
    -
        title: Materials Graph Ontology.
        year: 2021
        journal: Materials Letters
        authors:
            -
                name: Sven P. Voigt
            -
                name: Surya R. Kalidindi
        links:
            -
                linkType: pdf
                icon: "fa-solid fa-file-pdf"
                url: "https://www.sciencedirect.com/science/article/am/pii/S0167577X21005322"
            -
                icon: "ai ai-doi"
                url: "https://doi.org/10.1016/j.matlet.2021.129836"
    -
        title: Critical Comparison of Image Analysis Workflows
        year: 2021
        journal: Biomedical Materials
        authors: 
            -
                name: K Ravikumar
            -
                name: Sven P. Voigt
            -
                name: Surya R. Kalidindi
            -
                name: Bikramjit Basu
        links:
            -
                icon: "ai ai-doi"
                url: "https://doi.org/10.1088/1748-605X/abcf5e"
    -
        title: Automated Image Processing Workflow for Morphological Analysis
        year: 2021
        journal: Journal of Materials
        authors: 
            -
                name: Sven P. Voigt
            -
                name: K Ravikumar
            -
                name: Bikramjit Basu
            -
                name: Surya R. Kalidindi
        links:
            -
                icon: "ai ai-doi"
                url: "https://doi.org/10.1007/s11837-021-04707-w"
---


<div id="publications" class="cardList">
{% for paper in page.papers %}
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
</div>