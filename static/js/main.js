document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('cat-grid');
    const loadMoreBtn = document.getElementById('load-more');
    const breedSelect = document.getElementById('breed-select');

    async function loadCats() {
        try {
            const response = await fetch('/api/cats');
            const cats = await response.json();
            
            cats.forEach(cat => {
                const card = document.createElement('div');
                card.className = 'cat-card';
                
                card.innerHTML = `
                    <img src="${cat.url}" alt="Cat">
                    <div class="cat-info">
                        ${cat.breeds && cat.breeds.length > 0 
                            ? `<h3>${cat.breeds[0].name}</h3>
                               <p>${cat.breeds[0].description}</p>`
                            : ''}
                    </div>
                `;
                
                grid.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading cats:', error);
        }
    }

    loadMoreBtn.addEventListener('click', loadCats);
    
    // Initial load
    loadCats();
});