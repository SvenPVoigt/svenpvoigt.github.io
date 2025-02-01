var articlePane;

loadArticle = function(el) {
    console.log(el);

    fetch(el.dataset.url)
        .then(response => response.text())
        .then(html => {
            // Parse the HTML string into a DOM object
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
        
            // Use querySelector on the parsed DOM
            const element = doc.querySelector('body');
            articlePane.innerHTML = element.innerHTML;
        })
        .catch(error => {
            console.error('Error fetching or parsing HTML:', error);
        });

    articlePane.classList.toggle("hidden");
    articlePane.classList.toggle("shown");
}


window.onload = function() {
    articlePane = document.getElementById("articleLayout");
}