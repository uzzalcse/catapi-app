// // static/js/app.js
// document.addEventListener('DOMContentLoaded', function () {
//     let currentTab = 'voting';
//     let currentBreed = '';
//     let currentImageId = '';

//     const tabs = {
//         voting: document.getElementById('voting-tab'),
//         breeds: document.getElementById('breeds-tab'),
//         favs: document.getElementById('favs-tab'),
//     };

//     const breedSelect = document.getElementById('breed-select');
//     const catImage = document.getElementById('cat-image');
//     const loading = document.getElementById('loading');
//     const dislikeBtn = document.getElementById('dislike-btn');
//     const likeBtn = document.getElementById('like-btn');
//     const favoriteBtn = document.getElementById('favorite-btn');
//     const errorContainer = document.getElementById('error-container'); // Optional error message display

//     function showError(message) {
//         errorContainer.textContent = message;
//         errorContainer.style.display = 'block';
//     }

//     function clearError() {
//         errorContainer.textContent = '';
//         errorContainer.style.display = 'none';
//     }

//     async function loadBreeds() {
//         try {
//             const response = await fetch('/api/breeds');
//             if (!response.ok) throw new Error('Failed to fetch breeds');
//             const breeds = await response.json();

//             breedSelect.innerHTML = '<option value="">Select Breed</option>';
//             breeds.forEach(breed => {
//                 const option = document.createElement('option');
//                 option.value = breed.id;
//                 option.textContent = breed.name;
//                 breedSelect.appendChild(option);
//             });

//             if (currentTab === 'breeds' && breeds.length > 0) {
//                 breedSelect.value = breeds[0].id;
//                 currentBreed = breeds[0].id;
//                 loadNewCat();
//             }
//         } catch (err) {
//             console.error('Failed to load breeds:', err);
//             showError('Could not load breeds. Please try again later.');
//         }
//     }

//     async function loadNewCat() {
//         showLoading();
//         try {
//             const url = `/api/cat${currentBreed ? '?breed_id=' + currentBreed : ''}`;
//             const response = await fetch(url);
//             if (!response.ok) throw new Error('Failed to fetch new cat');
//             const data = await response.json();

//             if (data && data.url) {
//                 currentImageId = data.id;
//                 catImage.src = data.url;
//                 catImage.alt = data.name || 'Cat';
//                 clearError();
//             } else {
//                 showError('No cat available for the selected breed.');
//             }
//         } catch (err) {
//             console.error('Failed to load new cat:', err);
//             showError('Could not load a new cat. Please try again later.');
//         } finally {
//             hideLoading();
//         }
//     }

//     function showLoading() {
//         loading.style.display = 'block';
//         catImage.style.display = 'none';
//     }

//     function hideLoading() {
//         loading.style.display = 'none';
//         catImage.style.display = 'block';
//     }

//     async function voteCat(voteType) {
//         try {
//             const response = await fetch('/api/vote', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ image_id: currentImageId, vote: voteType }),
//             });

//             if (response.ok) {
//                 console.log('Vote submitted successfully');
//                 loadNewCat();
//             } else {
//                 throw new Error('Failed to submit vote');
//             }
//         } catch (err) {
//             console.error('Error voting for cat:', err);
//             showError('Failed to submit your vote. Please try again.');
//         }
//     }

//     async function toggleFavorite() {
//         try {
//             const response = await fetch('/api/favorite', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ image_id: currentImageId }),
//             });

//             if (response.ok) {
//                 console.log('Favorite toggled successfully');
//             } else {
//                 throw new Error('Failed to toggle favorite');
//             }
//         } catch (err) {
//             console.error('Error toggling favorite:', err);
//             showError('Failed to toggle favorite. Please try again.');
//         }
//     }

//     // Event Listeners
//     breedSelect.addEventListener('change', function () {
//         currentBreed = breedSelect.value;
//         loadNewCat();
//     });

//     dislikeBtn.addEventListener('click', function () {
//         voteCat('dislike');
//     });

//     likeBtn.addEventListener('click', function () {
//         voteCat('like');
//     });

//     favoriteBtn.addEventListener('click', function () {
//         toggleFavorite();
//     });

//     Object.keys(tabs).forEach(tab => {
//         tabs[tab].addEventListener('click', function () {
//             currentTab = tab;
//             if (tab === 'breeds') {
//                 loadBreeds();
//             } else if (tab === 'voting') {
//                 loadNewCat();
//             }

//             document.querySelector('.tab.active').classList.remove('active');
//             tabs[tab].classList.add('active');
//         });
//     });

//     // Initial load
//     tabs.voting.classList.add('active');
//     loadBreeds();
//     loadNewCat();
// });



// // static/js/app.js
// document.addEventListener('DOMContentLoaded', function () {
//     let currentTab = 'voting';
//     let currentBreed = '';
//     let currentImageId = '';
//     let favoriteCats = [];

//     const tabs = {
//         voting: document.getElementById('voting-tab'),
//         breeds: document.getElementById('breeds-tab'),
//         favs: document.getElementById('favs-tab'),
//     };

//     const breedSelect = document.getElementById('breed-select');
//     const catImage = document.getElementById('cat-image');
//     const loading = document.getElementById('loading');
//     const dislikeBtn = document.getElementById('dislike-btn');
//     const likeBtn = document.getElementById('like-btn');
//     const favoriteBtn = document.getElementById('favorite-btn');
//     const errorContainer = document.getElementById('error-container');

//     function showError(message) {
//         errorContainer.textContent = message;
//         errorContainer.style.display = 'block';
//     }

//     function clearError() {
//         errorContainer.textContent = '';
//         errorContainer.style.display = 'none';
//     }

//     async function loadBreeds() {
//         try {
//             const response = await fetch('/api/breeds');
//             if (!response.ok) throw new Error('Failed to fetch breeds');
//             const breeds = await response.json();

//             breedSelect.innerHTML = '<option value="">Select Breed</option>';
//             breeds.forEach(breed => {
//                 const option = document.createElement('option');
//                 option.value = breed.id;
//                 option.textContent = breed.name;
//                 breedSelect.appendChild(option);
//             });

//             if (currentTab === 'breeds' && breeds.length > 0) {
//                 breedSelect.value = breeds[0].id;
//                 currentBreed = breeds[0].id;
//                 loadNewCat();
//             }
//         } catch (err) {
//             console.error('Failed to load breeds:', err);
//             showError('Could not load breeds. Please try again later.');
//         }
//     }

//     async function loadNewCat() {
//         showLoading();
//         try {
//             const url = `/api/cat${currentBreed ? '?breed_id=' + currentBreed : ''}`;
//             const response = await fetch(url);
//             if (!response.ok) throw new Error('Failed to fetch new cat');
//             const data = await response.json();

//             console.log('New cat data:', data); // Log data to check if a new cat is returned

//             if (data && data.url) {
//                 currentImageId = data.id; // Ensure we update the currentImageId
//                 catImage.src = data.url;
//                 catImage.alt = data.name || 'Cat';
//                 clearError();
//             } else {
//                 showError('No cat available for the selected breed.');
//             }
//         } catch (err) {
//             console.error('Failed to load new cat:', err);
//             showError('Could not load a new cat. Please try again later.');
//         } finally {
//             hideLoading();
//         }
//     }

//     async function loadFavorites() {
//         try {
//             const response = await fetch('/api/favorites');
//             if (!response.ok) throw new Error('Failed to fetch favorites');
//             const favorites = await response.json();

//             const favsContainer = document.getElementById('favs-container');
//             favsContainer.innerHTML = ''; // Clear existing favorites
//             favorites.forEach(fav => {
//                 const favImage = document.createElement('img');
//                 favImage.src = fav.url;
//                 favImage.alt = fav.name || 'Favorite Cat';
//                 favsContainer.appendChild(favImage);
//             });
//         } catch (err) {
//             console.error('Failed to load favorites:', err);
//             showError('Could not load favorites. Please try again later.');
//         }
//     }

//     function showLoading() {
//         loading.style.display = 'block';
//         catImage.style.display = 'none';
//     }

//     function hideLoading() {
//         loading.style.display = 'none';
//         catImage.style.display = 'block';
//     }

//     async function toggleFavorite() {
//         try {
//             const response = await fetch('/api/favorite', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ image_id: currentImageId }),
//             });

//             if (response.ok) {
//                 console.log('Favorite toggled successfully');
//                 favoriteCats.push({ id: currentImageId, url: catImage.src });
//                 if (currentTab === 'favs') {
//                     loadFavorites();
//                 }
//             } else {
//                 throw new Error('Failed to toggle favorite');
//             }
//         } catch (err) {
//             console.error('Error toggling favorite:', err);
//             showError('Failed to toggle favorite. Please try again.');
//         }
//     }

//     // Event Listeners
//     breedSelect.addEventListener('change', function () {
//         currentBreed = breedSelect.value;
//         loadNewCat();
//     });

//     dislikeBtn.addEventListener('click', function () {
//         console.log('Dislike button clicked');
//         loadNewCat(); // Simply load a new cat when the "dislike" button is clicked
//     });

//     likeBtn.addEventListener('click', function () {
//         console.log('Like button clicked');
//         loadNewCat(); // Simply load a new cat when the "like" button is clicked
//     });

//     favoriteBtn.addEventListener('click', function () {
//         toggleFavorite();
//     });

//     Object.keys(tabs).forEach(tab => {
//         tabs[tab].addEventListener('click', function () {
//             currentTab = tab;
//             if (tab === 'breeds') {
//                 loadBreeds();
//             } else if (tab === 'voting') {
//                 loadNewCat();
//             } else if (tab === 'favs') {
//                 loadFavorites();
//             }

//             document.querySelector('.tab.active').classList.remove('active');
//             tabs[tab].classList.add('active');
//         });
//     });

//     // Initial load
//     tabs.voting.classList.add('active');
//     loadBreeds();
//     loadNewCat();
// });





// // static/js/app.js
// document.addEventListener('DOMContentLoaded', function () {
//     let currentTab = 'voting';
//     let currentBreed = '';
//     let currentImageId = '';
//     let favoriteCats = JSON.parse(localStorage.getItem('favoriteCats')) || [];

//     const tabs = {
//         voting: document.getElementById('voting-tab'),
//         breeds: document.getElementById('breeds-tab'),
//         favs: document.getElementById('favs-tab'),
//     };

//     const breedSelect = document.getElementById('breed-select');
//     const catImage = document.getElementById('cat-image');
//     const loading = document.getElementById('loading');
//     const dislikeBtn = document.getElementById('dislike-btn');
//     const likeBtn = document.getElementById('like-btn');
//     const favoriteBtn = document.getElementById('favorite-btn');
//     const errorContainer = document.getElementById('error-container');
//     const favsContainer = document.getElementById('favs-container'); // Container for displaying favs

//     function showError(message) {
//         errorContainer.textContent = message;
//         errorContainer.style.display = 'block';
//     }

//     function clearError() {
//         errorContainer.textContent = '';
//         errorContainer.style.display = 'none';
//     }

//     async function loadBreeds() {
//         try {
//             const response = await fetch('/api/breeds');
//             if (!response.ok) throw new Error('Failed to fetch breeds');
//             const breeds = await response.json();

//             breedSelect.innerHTML = '<option value="">Select Breed</option>';
//             breeds.forEach(breed => {
//                 const option = document.createElement('option');
//                 option.value = breed.id;
//                 option.textContent = breed.name;
//                 breedSelect.appendChild(option);
//             });

//             if (currentTab === 'breeds' && breeds.length > 0) {
//                 breedSelect.value = breeds[0].id;
//                 currentBreed = breeds[0].id;
//                 loadNewCat();
//             }
//         } catch (err) {
//             console.error('Failed to load breeds:', err);
//             showError('Could not load breeds. Please try again later.');
//         }
//     }

//     async function loadNewCat() {
//         showLoading();
//         try {
//             const url = `/api/cat${currentBreed ? '?breed_id=' + currentBreed : ''}`;
//             const response = await fetch(url);
//             if (!response.ok) throw new Error('Failed to fetch new cat');
//             const data = await response.json();

//             if (data && data.url) {
//                 currentImageId = data.id;
//                 catImage.src = data.url;
//                 catImage.alt = data.name || 'Cat';
//                 clearError();
//             } else {
//                 showError('No cat available for the selected breed.');
//             }
//         } catch (err) {
//             console.error('Failed to load new cat:', err);
//             showError('Could not load a new cat. Please try again later.');
//         } finally {
//             hideLoading();
//         }
//     }

//     async function loadFavorites() {
//         favsContainer.innerHTML = ''; // Clear the current favorites container

//         if (favoriteCats.length > 0) {
//             favoriteCats.forEach(fav => {
//                 const favImage = document.createElement('img');
//                 favImage.src = fav.url;
//                 favImage.alt = fav.name || 'Favorite Cat';
//                 favsContainer.appendChild(favImage);
//             });
//         } else {
//             favsContainer.innerHTML = '<p>No favorites yet.</p>';
//         }
//     }

//     function showLoading() {
//         loading.style.display = 'block';
//         catImage.style.display = 'none';
//     }

//     function hideLoading() {
//         loading.style.display = 'none';
//         catImage.style.display = 'block';
//     }

//     function saveFavoriteCat(imageId, url, name) {
//         const favoriteCat = { id: imageId, url: url, name: name };
//         favoriteCats.push(favoriteCat);
//         localStorage.setItem('favoriteCats', JSON.stringify(favoriteCats));
//     }

//     function updateCatImageAfterFavorite() {
//         loadNewCat(); // Fetch a new image after favoriting the current one
//     }

//     // Event Listeners
//     breedSelect.addEventListener('change', function () {
//         currentBreed = breedSelect.value;
//         loadNewCat();
//     });

//     dislikeBtn.addEventListener('click', function () {
//         loadNewCat(); // Simply load a new cat when the "dislike" button is clicked
//     });

//     likeBtn.addEventListener('click', function () {
//         loadNewCat(); // Simply load a new cat when the "like" button is clicked
//     });

//     favoriteBtn.addEventListener('click', function () {
//         const imageUrl = catImage.src;
//         const imageName = catImage.alt;
//         saveFavoriteCat(currentImageId, imageUrl, imageName);
//         updateCatImageAfterFavorite();
//     });

//     Object.keys(tabs).forEach(tab => {
//         tabs[tab].addEventListener('click', function () {
//             currentTab = tab;
//             // Set active class for the clicked tab
//             document.querySelector('.tab.active').classList.remove('active');
//             tabs[tab].classList.add('active');

//             if (tab === 'breeds') {
//                 loadBreeds();
//             } else if (tab === 'voting') {
//                 loadNewCat();
//             } else if (tab === 'favs') {
//                 loadFavorites(); // This will show the saved favorite images
//             }
//         });
//     });

//     // Initial load
//     tabs.voting.classList.add('active');
//     loadBreeds();
//     loadNewCat();
// });



document.addEventListener('DOMContentLoaded', function () {
    let currentTab = 'voting'; // Start with the "Voting" tab active
    let currentBreed = '';
    let currentImageId = '';
    let favoriteCats = JSON.parse(localStorage.getItem('favoriteCats')) || [];

    const tabs = {
        voting: document.getElementById('voting-tab'),
        breeds: document.getElementById('breeds-tab'),
        favs: document.getElementById('favs-tab'),
    };

    const breedSelect = document.getElementById('breed-select');
    const catImage = document.getElementById('cat-image');
    const loading = document.getElementById('loading');
    const dislikeBtn = document.getElementById('dislike-btn');
    const likeBtn = document.getElementById('like-btn');
    const favoriteBtn = document.getElementById('favorite-btn');
    const favsContainer = document.getElementById('favs-container');

    // Function to show and hide tab content
    function showTabContent(tab) {
        const sections = ['breeds-section', 'cat-display', 'favs-section'];

        // Hide all sections
        sections.forEach(section => {
            document.getElementById(section).classList.add('hidden');
        });

        // Show the selected tab content
        if (tab === 'voting') {
            document.getElementById('cat-display').classList.remove('hidden');
        } else if (tab === 'breeds') {
            document.getElementById('breeds-section').classList.remove('hidden');
        } else if (tab === 'favs') {
            document.getElementById('favs-section').classList.remove('hidden');
            loadFavorites(); // Load saved favorites when "Favs" tab is selected
        }
    }

    // Event listeners for tab switching
    Object.keys(tabs).forEach(tab => {
        tabs[tab].addEventListener('click', function () {
            currentTab = tab;

            // Remove the active class from all tabs
            document.querySelector('.tab-btn.active').classList.remove('active');

            // Add the active class to the clicked tab
            tabs[tab].classList.add('active');

            // Show the corresponding content for the selected tab
            showTabContent(tab);
        });
    });

    // Event listeners for buttons (like, dislike, favorite)
    likeBtn.addEventListener('click', function () {
        loadNewCat(); // Load a new cat image
    });

    dislikeBtn.addEventListener('click', function () {
        loadNewCat(); // Load a new cat image
    });

    favoriteBtn.addEventListener('click', function () {
        addCatToFavorites();
        loadNewCat(); // Load a new cat image after saving to favorites
        updateFavoriteButton(); // Update the heart button
    });

    async function loadBreeds() {
        try {
            const response = await fetch('/api/breeds');
            if (!response.ok) throw new Error('Failed to fetch breeds');
            const breeds = await response.json();

            breedSelect.innerHTML = '<option value="">Select Breed</option>';
            breeds.forEach(breed => {
                const option = document.createElement('option');
                option.value = breed.id;
                option.textContent = breed.name;
                breedSelect.appendChild(option);
            });

            if (currentTab === 'breeds' && breeds.length > 0) {
                breedSelect.value = breeds[0].id;
                currentBreed = breeds[0].id;
                loadNewCat();
            }
        } catch (err) {
            console.error('Failed to load breeds:', err);
        }
    }

    async function loadNewCat() {
        showLoading();
        try {
            const url = `/api/cat${currentBreed ? '?breed_id=' + currentBreed : ''}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch new cat');
            const data = await response.json();

            if (data && data.url) {
                currentImageId = data.id;
                catImage.src = data.url;
                catImage.alt = data.name || 'Cat';
            }
        } catch (err) {
            console.error('Failed to load new cat:', err);
        } finally {
            hideLoading();
        }
    }

    function showLoading() {
        loading.style.display = 'block';
        catImage.style.display = 'none';
    }

    function hideLoading() {
        loading.style.display = 'none';
        catImage.style.display = 'block';
    }

    function loadFavorites() {
        favsContainer.innerHTML = '';
        if (favoriteCats.length > 0) {
            favoriteCats.forEach(fav => {
                const favImage = document.createElement('img');
                favImage.src = fav.url;
                favImage.alt = fav.name || 'Favorite Cat';
                favsContainer.appendChild(favImage);
            });
        } else {
            favsContainer.innerHTML = '<p>No favorites yet.</p>';
        }
    }

    function addCatToFavorites() {
        const catData = {
            id: currentImageId,
            url: catImage.src,
            name: catImage.alt || 'Unnamed Cat'
        };

        // Avoid duplicates
        if (!favoriteCats.some(cat => cat.id === catData.id)) {
            favoriteCats.push(catData);
            localStorage.setItem('favoriteCats', JSON.stringify(favoriteCats));
        }
    }

    function updateFavoriteButton() {
        const isFavorite = favoriteCats.some(cat => cat.id === currentImageId);

        if (isFavorite) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart text-red-500"></i>';
        } else {
            favoriteBtn.innerHTML = '<i class="fas fa-heart text-gray-400"></i>';
        }
    }

    // Initial setup
    showTabContent(currentTab); // Show the content of the "voting" tab initially
    loadBreeds(); // Load breeds
    loadNewCat(); // Load a cat for voting
    updateFavoriteButton(); // Update the favorite button state based on current cat
});
