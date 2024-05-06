//This is the javascript code used to manage the CRUD operations on the articles from the ruby backend
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('articleForm');
    const articlesList = document.getElementById('articlesList');

    // Function that starts with GET request to the ruby backend address, once the response has been recorderded it is parsed and then the DOM is updated
    function fetchArticles() {
        fetch('http://127.0.0.1:3000/articles')
        .then(response => response.json())
        .then(data => {
            articlesList.innerHTML = ''; 
            data.forEach(article => {
                const li = document.createElement('li');
                const title = document.createElement('h1');
                title.textContent = article.title;

                //template of pbody
                const body = document.createElement('p');
                body.textContent = article.body;

                // shows whtehr the article is published or not
                const status = document.createElement('p');
                status.textContent = article.published ? 'Published Article' : 'Unpublished Article';
                status.style.fontWeight = 'bold';

                // btn container
                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'button-group';

                // Creating edit btn
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.className = 'btn edit';
                editBtn.onclick = () => editArticle(article);

                // Creating Delete btn
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'btn delete';
                deleteBtn.onclick = () => deleteArticle(article.id);

                //appends all of the elements created and linnks it to articles list
                buttonGroup.appendChild(editBtn);
                buttonGroup.appendChild(deleteBtn);

                li.appendChild(title);
                li.appendChild(body);
                li.appendChild(status);  
                li.appendChild(buttonGroup);
                articlesList.appendChild(li);
            });
        });
    }

    // Funtion that determines whther the user is editing or creating a new article
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const articleId = document.getElementById('articleId').value;
        const isUpdate = articleId !== '';
        const url = isUpdate ? `http://127.0.0.1:3000/articles/${articleId}` : 'http://127.0.0.1:3000/articles';
        const method = isUpdate ? 'PUT' : 'POST';

        const articleData = {
            title: document.getElementById('title').value,
            body: document.getElementById('body').value,
            published: document.getElementById('published').checked,
        };

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ article: articleData })
        })
        .then(response => response.json())
        .then(() => {
            form.reset();
            document.getElementById('articleId').value = '';
            fetchArticles();
        });
    });

    // function that edits the article
    function editArticle(article) {
        document.getElementById('articleId').value = article.id;
        document.getElementById('title').value = article.title;
        document.getElementById('body').value = article.body;
        document.getElementById('published').checked = article.published;
    }

    // Function that deletes the article
    function deleteArticle(articleId) {
        fetch(`http://127.0.0.1:3000/articles/${articleId}`, {
            method: 'DELETE'
        })
        .then(() => fetchArticles());
    }

    fetchArticles();
});
