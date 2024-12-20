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



// document.addEventListener('DOMContentLoaded', function () {
//     let currentTab = 'voting'; // Start with the "Voting" tab active
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
//     const favsContainer = document.getElementById('favs-container');

//     // Function to show and hide tab content
//     function showTabContent(tab) {
//         const sections = ['breeds-section', 'cat-display', 'favs-section'];

//         // Hide all sections
//         sections.forEach(section => {
//             document.getElementById(section).classList.add('hidden');
//         });

//         // Show the selected tab content
//         if (tab === 'voting') {
//             document.getElementById('cat-display').classList.remove('hidden');
//         } else if (tab === 'breeds') {
//             document.getElementById('breeds-section').classList.remove('hidden');
//         } else if (tab === 'favs') {
//             document.getElementById('favs-section').classList.remove('hidden');
//             loadFavorites(); // Load saved favorites when "Favs" tab is selected
//         }
//     }

//     // Event listeners for tab switching
//     Object.keys(tabs).forEach(tab => {
//         tabs[tab].addEventListener('click', function () {
//             currentTab = tab;

//             // Remove the active class from all tabs
//             document.querySelector('.tab-btn.active').classList.remove('active');

//             // Add the active class to the clicked tab
//             tabs[tab].classList.add('active');

//             // Show the corresponding content for the selected tab
//             showTabContent(tab);
//         });
//     });

//     // Event listeners for buttons (like, dislike, favorite)
//     likeBtn.addEventListener('click', function () {
//         loadNewCat(); // Load a new cat image
//     });

//     dislikeBtn.addEventListener('click', function () {
//         loadNewCat(); // Load a new cat image
//     });

//     favoriteBtn.addEventListener('click', function () {
//         addCatToFavorites();
//         loadNewCat(); // Load a new cat image after saving to favorites
//         updateFavoriteButton(); // Update the heart button
//     });

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
//             }
//         } catch (err) {
//             console.error('Failed to load new cat:', err);
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

//     function loadFavorites() {
//         favsContainer.innerHTML = '';
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

//     function addCatToFavorites() {
//         const catData = {
//             id: currentImageId,
//             url: catImage.src,
//             name: catImage.alt || 'Unnamed Cat'
//         };

//         // Avoid duplicates
//         if (!favoriteCats.some(cat => cat.id === catData.id)) {
//             favoriteCats.push(catData);
//             localStorage.setItem('favoriteCats', JSON.stringify(favoriteCats));
//         }
//     }

//     function updateFavoriteButton() {
//         const isFavorite = favoriteCats.some(cat => cat.id === currentImageId);

//         if (isFavorite) {
//             favoriteBtn.innerHTML = '<i class="fas fa-heart text-red-500"></i>';
//         } else {
//             favoriteBtn.innerHTML = '<i class="fas fa-heart text-gray-400"></i>';
//         }
//     }

//     // Initial setup
//     showTabContent(currentTab); // Show the content of the "voting" tab initially
//     loadBreeds(); // Load breeds
//     loadNewCat(); // Load a cat for voting
//     updateFavoriteButton(); // Update the favorite button state based on current cat
// });


// document.addEventListener('DOMContentLoaded', function () {
//     let currentTab = 'voting'; // Start with the "Voting" tab active
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
//     const favsContainer = document.getElementById('favs-container');

//     // Function to show and hide tab content
//     function showTabContent(tab) {
//         const sections = ['breeds-section', 'cat-display', 'favs-section'];

//         // Hide all sections
//         sections.forEach(section => {
//             document.getElementById(section).classList.add('hidden');
//         });

//         // Show the selected tab content
//         if (tab === 'voting') {
//             document.getElementById('cat-display').classList.remove('hidden');
//         } else if (tab === 'breeds') {
//             document.getElementById('breeds-section').classList.remove('hidden');
//         } else if (tab === 'favs') {
//             document.getElementById('favs-section').classList.remove('hidden');
//             loadFavorites(); // Load saved favorites when "Favs" tab is selected
//         }

//         console.log(`Tab switched to: ${tab}`);
//     }

//     // Event listeners for tab switching
//     Object.keys(tabs).forEach(tab => {
//         tabs[tab].addEventListener('click', function () {
//             currentTab = tab;

//             // Remove the active class from all tabs
//             document.querySelector('.tab-btn.active').classList.remove('active');

//             // Add the active class to the clicked tab
//             tabs[tab].classList.add('active');

//             // Show the corresponding content for the selected tab
//             showTabContent(tab);
//         });
//     });

//     // Event listeners for buttons (like, dislike, favorite)
//     likeBtn.addEventListener('click', function () {
//         console.log('Like button clicked');
//         loadNewCatForVoting(); // Load a new cat image in the voting tab
//     });

//     dislikeBtn.addEventListener('click', function () {
//         console.log('Dislike button clicked');
//         loadNewCatForVoting(); // Load a new cat image in the voting tab
//     });

//     favoriteBtn.addEventListener('click', function () {
//         console.log('Favorite button clicked');
//         addCatToFavorites();
//         loadNewCatForVoting(); // Load a new cat image after saving to favorites
//         updateFavoriteButton(); // Update the heart button
//     });

//     async function loadBreeds() {
//         console.log('Loading breeds...');
//         try {
//             const response = await fetch('/api/breeds');
//             if (!response.ok) throw new Error('Failed to fetch breeds');
//             const breeds = await response.json();
//             console.log('Breeds loaded:', breeds);

//             breedSelect.innerHTML = '<option value="">Select Breed</option>';
//             breeds.forEach(breed => {
//                 const option = document.createElement('option');
//                 option.value = breed.id;
//                 option.textContent = breed.name;
//                 breedSelect.appendChild(option);
//             });

//             // If a breed is selected by default, show the corresponding cat image
//             if (currentTab === 'breeds' && breeds.length > 0) {
//                 breedSelect.value = breeds[0].id;
//                 currentBreed = breeds[0].id;
//                 loadNewCatForBreeds(); // Show breed-related cat image
//             }
//         } catch (err) {
//             console.error('Failed to load breeds:', err);
//         }
//     }

//     // Function to load new cat image for "Voting" tab
//     async function loadNewCatForVoting() {
//         console.log('Loading new cat for voting...');
//         showLoading();
//         try {
//             let url = `/api/cat`;


//             console.log('Fetching URL:', url);
//             const response = await fetch(url);
//             if (!response.ok) throw new Error('Failed to fetch new cat');
//             const data = await response.json();

//             console.log('Cat data received:', data);

//             if (data && data.url) {
//                 currentImageId = data.id;
//                 catImage.src = data.url;
//                 catImage.alt = data.name || 'Cat';
//             }
//         } catch (err) {
//             console.error('Failed to load new cat for voting:', err);
//         } finally {
//             hideLoading();
//         }
//     }

//     // Function to load new cat image for "Breeds" tab
//     async function loadNewCatForBreeds() {
//         console.log('Loading new cat for breed...');
//         showLoading();
//         try {
//             const breedId = breedSelect.value;
//             if (!breedId) return;

//             const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`;

//             console.log('Fetching breed cat image URL:', url);
//             const response = await fetch(url);
//             if (!response.ok) throw new Error('Failed to fetch breed cat image');
//             const data = await response.json();

//             console.log('Breed cat data:', data);

//             if (data && data.length > 0 && data[0].url) {
//                 currentImageId = data[0].id;
//                 catImage.src = data[0].url;
//                 catImage.alt = data[0].name || 'Cat';
//             }
//         } catch (err) {
//             console.error('Failed to load cat for breed:', err);
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

//     function loadFavorites() {
//         favsContainer.innerHTML = '';
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

//     function addCatToFavorites() {
//         const catData = {
//             id: currentImageId,
//             url: catImage.src,
//             name: catImage.alt || 'Unnamed Cat'
//         };

//         // Avoid duplicates
//         if (!favoriteCats.some(cat => cat.id === catData.id)) {
//             favoriteCats.push(catData);
//             localStorage.setItem('favoriteCats', JSON.stringify(favoriteCats));
//             console.log('Cat added to favorites:', catData);
//         } else {
//             console.log('Cat is already in favorites');
//         }
//     }

//     function updateFavoriteButton() {
//         const isFavorite = favoriteCats.some(cat => cat.id === currentImageId);

//         if (isFavorite) {
//             favoriteBtn.innerHTML = '<i class="fas fa-heart text-red-500"></i>';
//         } else {
//             favoriteBtn.innerHTML = '<i class="fas fa-heart text-gray-400"></i>';
//         }
//     }

//     // Initial setup
//     showTabContent(currentTab); // Show the content of the "voting" tab initially
//     loadBreeds(); // Load breeds in the "breeds" tab
//     loadNewCatForVoting(); // Load a cat for voting (for the "voting" tab)
//     updateFavoriteButton(); // Update the favorite button state based on current cat
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

        console.log(`Tab switched to: ${tab}`);
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
        console.log('Like button clicked');
        loadNewCatForVoting(); // Load a new cat image in the voting tab
    });

    dislikeBtn.addEventListener('click', function () {
        console.log('Dislike button clicked');
        loadNewCatForVoting(); // Load a new cat image in the voting tab
    });

    favoriteBtn.addEventListener('click', function () {
        console.log('Favorite button clicked');
        addCatToFavorites();
        loadNewCatForVoting(); // Load a new cat image after saving to favorites
        updateFavoriteButton(); // Update the heart button
    });

    async function loadBreeds() {
        console.log('Loading breeds...');
        try {
            const response = await fetch('/api/breeds');
            if (!response.ok) throw new Error('Failed to fetch breeds');
            const breeds = await response.json();
            console.log('Breeds loaded:', breeds);

            breedSelect.innerHTML = '<option value="">Select Breed</option>';
            breeds.forEach(breed => {
                const option = document.createElement('option');
                option.value = breed.id;
                option.textContent = breed.name;
                breedSelect.appendChild(option);
            });

            // Set default breed and load a cat for it
            if (breeds.length > 0) {
                breedSelect.value = breeds[0].id;
                currentBreed = breeds[0].id;
                loadNewCatForBreeds(); // Show breed-related cat image
            }

            // Add event listener for breed change
            breedSelect.addEventListener('change', function () {
                currentBreed = breedSelect.value;
                console.log('Breed selected:', currentBreed);
                loadNewCatForBreeds(); // Fetch new cat image based on selected breed
            });
        } catch (err) {
            console.error('Failed to load breeds:', err);
        }
    }

    // Function to load new cat image for "Voting" tab
    async function loadNewCatForVoting() {
        console.log('Loading new cat for voting...');
        showLoading();
        try {
            let url = `/api/cat`;

            // if (currentBreed) {
            //     url = `/api/cat?breed_id=${currentBreed}`;
            // }

            console.log('Fetching URL:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch new cat');
            const data = await response.json();

            console.log('Cat data received:', data);

            if (data && data.url) {
                currentImageId = data.id;
                catImage.src = data.url;
                catImage.alt = data.name || 'Cat';
            }
        } catch (err) {
            console.error('Failed to load new cat for voting:', err);
        } finally {
            hideLoading();
        }
    }


    // async function loadNewCatForBreeds() {
    //     console.log('Loading new cat for breed...');
    //     showLoading(); // Show loading indicator
    //     try {
    //         const breedId = breedSelect.value;
    //         if (!breedId) return; // If no breed is selected, do nothing
    
    //         const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`;
    
    //         console.log('Fetching breed cat image URL:', url);
    //         const response = await fetch(url);
    //         if (!response.ok) throw new Error('Failed to fetch breed cat image');
    //         const data = await response.json();
    
    //         console.log('Breed cat data:', data);
    
    //         if (data && data.length > 0 && data[0].url) {
    //             currentImageId = data[0].id;
    //             const breedCatImage = document.getElementById('breed-cat-image');
    //             breedCatImage.src = data[0].url;
    //             breedCatImage.alt = `Cat breed: ${breedId}`;
    //             breedCatImage.style.display = 'block'; // Ensure the image is visible
    
    //             // Fetch breed details
    //             const breedDetails = await fetch(`https://api.thecatapi.com/v1/breeds/${breedId}`);
    //             if (!breedDetails.ok) throw new Error('Failed to fetch breed details');
    //             const breedInfo = await breedDetails.json();
    
    //             // Display breed name, id, and description
    //             const breedName = document.getElementById('breed-name');
    //             const breedIdElem = document.getElementById('breed-id');
    //             const breedDescription = document.getElementById('breed-description');
    //             const wikiLink = document.getElementById('breed-wiki-link');

    //             breedName.textContent = `Breed: ${breedInfo.name}`;
    //             breedIdElem.textContent = `ID: ${breedInfo.id}`;
    //             breedDescription.textContent = `Description: ${breedInfo.description}`;
    //             wikiLink.href = `${breedInfo.wikipedia_url}`;
    //         } else {
    //             console.log('No image found for the selected breed.');
    //         }
    //     } catch (err) {
    //         console.error('Failed to load cat for breed:', err);
    //     } finally {
    //         hideLoading(); // Hide loading indicator
    //     }
    // }
    
    
    //follwing is the corrected for carousel 


    // async function loadNewCatForBreeds() {
    //     console.log('Loading new cats for breed...');
    //     showLoading(); // Show loading indicator
    //     try {
    //         const breedId = breedSelect.value;
    //         if (!breedId) return; // If no breed is selected, do nothing
    
    //         const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=8`; // Fetch 8 images
    
    //         console.log('Fetching breed cat image URLs:', url);
    //         const response = await fetch(url);
    //         if (!response.ok) throw new Error('Failed to fetch breed cat images');
    //         const data = await response.json();
    
    //         console.log('Breed cat data:', data);
    
    //         if (data && data.length > 0) {
    //             // Clear previous images
    //             const breedImage = document.getElementById('breed-cat-image');
    //             const dotsContainer = document.getElementById('carousel-dots');
    //             dotsContainer.innerHTML = ''; // Clear previous dots
    
    //             // Set the first image initially
    //             breedImage.src = data[0].url;
    //             breedImage.style.display = 'block'; // Ensure the first image is visible
    
    //             // Create and append dots for navigation
    //             data.forEach((cat, index) => {
    //                 const dot = document.createElement('span');
    //                 dot.classList.add('dot', 'w-3', 'h-3', 'bg-gray-500', 'rounded-full', 'cursor-pointer');
    //                 dot.addEventListener('click', () => changeImage(index));
    //                 dotsContainer.appendChild(dot);
    //             });
    
    //             // Automatic image change every 2 seconds
    //             let currentImageIndex = 0;
    //             const dots = dotsContainer.getElementsByClassName('dot');
    
    //             setInterval(() => {
    //                 currentImageIndex = (currentImageIndex + 1) % data.length;
    //                 changeImage(currentImageIndex);
    //             }, 4000); // Change image every 2 seconds
    
    //             // Change image based on index
    //             function changeImage(index) {
    //                 breedImage.src = data[index].url;
                    
    //                 // Remove active class from all dots
    //                 Array.from(dots).forEach(dot => dot.classList.remove('bg-blue-500'));
    
    //                 // Add active class to the selected dot
    //                 dots[index].classList.add('bg-blue-500');
    //             }


    //         } else {
    //             console.log('No images found for the selected breed.');
    //         }
    //     } catch (err) {
    //         console.error('Failed to load cat images for breed:', err);
    //     } finally {
    //         hideLoading(); // Hide loading indicator
    //     }
    // }
    

    async function loadNewCatForBreeds() {
        console.log('Loading new cats for breed...');
        showLoading(); // Show loading indicator
        try {
            const breedId = breedSelect.value;
            if (!breedId) return; // If no breed is selected, do nothing
    
            const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=8`; // Fetch 8 images
            const breedInfoUrl = `https://api.thecatapi.com/v1/breeds/${breedId}`; // Get breed details
    
            console.log('Fetching breed cat image URLs:', url);
            const imageResponse = await fetch(url);
            const breedResponse = await fetch(breedInfoUrl);
            
            if (!imageResponse.ok || !breedResponse.ok) throw new Error('Failed to fetch breed data or images');
            
            const imageData = await imageResponse.json();
            const breedData = await breedResponse.json();
    
            console.log('Breed data:', breedData);
            console.log('Breed cat data:', imageData);
    
            if (imageData && imageData.length > 0 && breedData) {
                // Clear previous images
                const breedImage = document.getElementById('breed-cat-image');
                const breedName = document.getElementById('breed-name');
                const breedIdElem = document.getElementById('breed-id');
                const breedDescription = document.getElementById('breed-description');
                const dotsContainer = document.getElementById('carousel-dots');
                dotsContainer.innerHTML = ''; // Clear previous dots
    
                // Set breed details
                breedName.textContent = breedData.name || 'Unknown Breed';
                breedIdElem.textContent = `Breed ID: ${breedData.id}`;
                breedDescription.textContent = breedData.description || 'No description available.';
                
                // Set the first image initially
                breedImage.src = imageData[0].url;
                breedImage.style.display = 'block'; // Ensure the first image is visible
    
                // Create and append dots for navigation
                imageData.forEach((cat, index) => {
                    const dot = document.createElement('span');
                    dot.classList.add('dot', 'w-3', 'h-3', 'bg-gray-500', 'rounded-full', 'cursor-pointer');
                    dot.addEventListener('click', () => changeImage(index));
                    dotsContainer.appendChild(dot);
                });
    
                // Automatic image change every 2 seconds
                let currentImageIndex = 0;
                const dots = dotsContainer.getElementsByClassName('dot');
    
                setInterval(() => {
                    currentImageIndex = (currentImageIndex + 1) % imageData.length;
                    changeImage(currentImageIndex);
                }, 4000); // Change image every 2 seconds
    
                // Change image based on index
                function changeImage(index) {
                    breedImage.src = imageData[index].url;
                    
                    // Remove active class from all dots
                    Array.from(dots).forEach(dot => dot.classList.remove('bg-blue-500'));
    
                    // Add active class to the selected dot
                    dots[index].classList.add('bg-blue-500');
                }
            } else {
                console.log('No images or breed data found for the selected breed.');
            }
        } catch (err) {
            console.error('Failed to load cat images for breed:', err);
        } finally {
            hideLoading(); // Hide loading indicator
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
            console.log('Cat added to favorites:', catData);
        } else {
            console.log('Cat is already in favorites');
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
    loadBreeds(); // Load breeds in the "breeds" tab
    loadNewCatForVoting(); // Load a cat for voting (for the "voting" tab)
    updateFavoriteButton(); // Update the favorite button state based on current cat
});
