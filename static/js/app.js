
document.addEventListener('DOMContentLoaded', function () {
    let currentTab = 'voting'; // Start with the "Voting" tab active
    let currentBreed = '';
    let currentImageId = '';
    let favoriteCats = JSON.parse(localStorage.getItem('favoriteCats')) || [];
    let currentBreedImageIndex = 0; // Track the current index of the breed carousel
    let imageChangeInterval; // Variable to store the interval ID

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
    likeBtn.addEventListener('click', loadNewCatForVoting);
    dislikeBtn.addEventListener('click', loadNewCatForVoting);
    favoriteBtn.addEventListener('click', function () {
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
            const response = await fetch(`/api/cat`);
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

    // Function to load breed images and info
    async function loadNewCatForBreeds() {
        console.log('Loading new cats for breed...');
        showLoading();
        try {
            const breedId = breedSelect.value;
            if (!breedId) return;
    
            console.log('Fetching breed cat images and info');
            const imageResponse = await fetch(`/api/breeds/${breedId}/search`);
            const breedResponse = await fetch(`/api/breeds/${breedId}`);
            
            if (!imageResponse.ok || !breedResponse.ok) {
                throw new Error('Failed to fetch breed data or images');
            }
    
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
    
                // Store the images data in a variable accessible to the changeImage function
                window.breedImages = imageData;
                
                // Set the first image initially
                breedImage.src = imageData[0].url;
                breedImage.style.display = 'block';
    
                // Create and append dots for navigation
                imageData.forEach((cat, index) => {
                    const dot = document.createElement('span');
                    dot.classList.add('dot', 'w-3', 'h-3', 'bg-gray-500', 'rounded-full', 'cursor-pointer', 'mx-1');
                    dot.addEventListener('click', () => changeImage(index));
                    dotsContainer.appendChild(dot);
                });
    
                // Make the first dot active
                const firstDot = dotsContainer.querySelector('.dot');
                if (firstDot) {
                    firstDot.classList.remove('bg-gray-500');
                    firstDot.classList.add('bg-blue-500');
                }
    
            } else {
                console.log('No images or breed data found for the selected breed.');
            }
        } catch (err) {
            console.error('Failed to load cat images for breed:', err);
        } finally {
            hideLoading();
        }
    }
    
    // Function to change image when dot is clicked
    function changeImage(index) {
        const breedImage = document.getElementById('breed-cat-image');
        const dotsContainer = document.getElementById('carousel-dots');
        const dots = dotsContainer.getElementsByClassName('dot');
    
        if (window.breedImages && window.breedImages[index]) {
            breedImage.src = window.breedImages[index].url;
            
            // Update dots
            Array.from(dots).forEach(dot => {
                dot.classList.remove('bg-blue-500');
                dot.classList.add('bg-gray-500');
            });
            dots[index].classList.remove('bg-gray-500');
            dots[index].classList.add('bg-blue-500');
        }
    }
    
    // Update breed select event listener
    breedSelect.addEventListener('change', function() {
        const selectedBreedId = this.value;
        console.log('Selected breed ID:', selectedBreedId);
        if (selectedBreedId) {
            loadNewCatForBreeds();
        }
    });
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

        if (!favoriteCats.some(cat => cat.id === catData.id)) {
            favoriteCats.push(catData);
            localStorage.setItem('favoriteCats', JSON.stringify(favoriteCats));
            console.log('Cat added to favorites:', catData);
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
    showTabContent(currentTab);
    loadBreeds();
    loadNewCatForVoting(); // Load the first cat for voting
});

