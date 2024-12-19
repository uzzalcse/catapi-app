document.addEventListener('DOMContentLoaded', function() {
    const catGrid = document.getElementById('cat-grid');
    const breedSelect = document.getElementById('breed-select');
    const loadMoreBtn = document.getElementById('load-more');
    const refreshBtn = document.getElementById('refresh-btn');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');

    // Load breeds for the select dropdown
    async function loadBreeds() {
        try {
            const response = await fetch('/api/breeds');
            const breeds = await response.json();
            
            breeds.forEach(breed => {
                const option = document.createElement('option');
                option.value = breed.id;
                option.textContent = breed.name;
                breedSelect.appendChild(option);
            });
        } catch (err) {
            showError('Failed to load breeds');
        }
    }

    // Load cats from the API
    async function loadCats(breedId = '') {
        showLoading();
        try {
            const limit = 9;
            const url = `/api/cats?limit=${limit}${breedId ? '&breed_id=' + breedId : ''}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to load cats');
            }
            
            const cats = await response.json();
            renderCats(cats);
            hideLoading();
        } catch (err) {
            hideLoading();
            showError(err.message);
        }
    }

    // Render cats to the grid
    function renderCats(cats) {
        cats.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'cat-card bg-white rounded-lg shadow-lg overflow-hidden';
            
            const breed = cat.breeds && cat.breeds[0];
            
            card.innerHTML = `
                <img src="${cat.url}" alt="Cat" class="cat-image">
                <div class="p-4">
                    ${breed ? `
                        <h3 class="font-bold text-xl mb-2">${breed.name}</h3>
                        <p class="text-gray-600 text-sm mb-2">${breed.temperament}</p>
                        <p class="text-gray-700">${breed.description}</p>
                        ${breed.wikipedia_url ? `
                            <a href="${breed.wikipedia_url}" target="_blank" 
                               class="text-blue-500 hover:text-blue-700 text-sm">
                                Learn More
                            </a>
                        ` : ''}
                    ` : ''}
                </div>
            `;
            
            catGrid.appendChild(card);
        });
    }

    function showLoading() {
        loading.classList.remove('hidden');
        error.classList.add('hidden');
    }

    function hideLoading() {
        loading.classList.add('hidden');
    }

    function showError(message) {
        error.classList.remove('hidden');
        errorMessage.textContent = message;
    }

    // Event Listeners
    breedSelect.addEventListener('change', (e) => {
        catGrid.innerHTML = '';
        loadCats(e.target.value);
    });

    loadMoreBtn.addEventListener('click', () => {
        loadCats(breedSelect.value);
    });

    refreshBtn.addEventListener('click', () => {
        catGrid.innerHTML = '';
        loadCats(breedSelect.value);
    });

    // Initial loads
    loadBreeds();
    loadCats();
});