
document.addEventListener('DOMContentLoaded', function () {
    let currentTab = 'voting'; // Start with the "Voting" tab active
    let currentBreed = '';
    let currentImageId = '';
    let favoriteCats = JSON.parse(localStorage.getItem('favoriteCats')) || [];
    let currentBreedImageIndex = 0; // Track the current index of the breed carousel
    let imageChangeInterval; // Variable to store the interval ID
    let currentView = 'grid'; // Default view

// Add these elements to your existing elements section
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');

    const tabs = {
        voting: document.getElementById('voting-tab'),
        breeds: document.getElementById('breeds-tab'),
        favs: document.getElementById('favs-tab'),
    };

    const breedSelect = document.getElementById('breed-select');
    const catImage = document.getElementById('cat-image');
    const loading = document.getElementById('loading');
    const votingBtns = document.getElementById('voting-btns');
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


    Object.keys(tabs).forEach(tab => {
        tabs[tab].addEventListener('click', function () {
            currentTab = tab;
    
            // Remove all active classes and reset styles from all tabs
            Object.values(tabs).forEach(tabElement => {
                tabElement.classList.remove('active');
                tabElement.classList.remove('text-orange-500');
                tabElement.classList.remove('border-b-2');
                tabElement.classList.remove('border-orange-500');
                tabElement.classList.add('text-gray-500');
            });
    
            // Add the active classes to the clicked tab
            tabs[tab].classList.add('active');
            tabs[tab].classList.add('text-orange-500');
            tabs[tab].classList.add('border-b-2');
            tabs[tab].classList.add('border-orange-500');
            tabs[tab].classList.remove('text-gray-500');
    
            // Show the corresponding content for the selected tab
            showTabContent(tab);
        });
    });


    // Event listener for like button
    likeBtn.addEventListener('click', function() {
        postVote(1); // 1 for like vote
    });

    // Event listener for dislike button
    dislikeBtn.addEventListener('click', function() {
        postVote(-1); // -1 for dislike vote
    });

    favoriteBtn.addEventListener('click', function () {
        addCatToFavorites();
        loadNewCatForVoting(); // Load a new cat image after saving to favorites
        updateFavoriteButton(); // Update the heart button
    });

    listViewBtn.addEventListener('click', () => {
        currentView = 'list';
        loadFavorites();
        updateViewButtons();
    });

    gridViewBtn.addEventListener('click', () => {
        currentView = 'grid';
        loadFavorites();
        updateViewButtons();
    });

    async function loadBreeds() {
        console.log('Loading breeds...');
        try {
            const response = await fetch('/api/breeds');
            if (!response.ok) throw new Error('Failed to fetch breeds');
            const breeds = await response.json();
            console.log('Breeds loaded:', breeds);

            breedSelect.innerHTML = '';
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
                const breedOrigin = document.getElementById('breed-origin');
                const breedIdElem = document.getElementById('breed-id');
                const breedDescription = document.getElementById('breed-description');
                const breedWikiLink = document.getElementById('breed-wiki-link');
                const dotsContainer = document.getElementById('carousel-dots');
                dotsContainer.innerHTML = ''; // Clear previous dots
    
                // Set breed details
                breedName.textContent = breedData.name || 'Unknown Breed';
                breedOrigin.textContent = `(${breedData.origin || 'Unknown'})`;
                breedIdElem.textContent = `${breedData.id}`;
                breedDescription.textContent = breedData.description || 'No description available.';
                breedWikiLink.href = `${breedData.wikipedia_url}`;

                console.log('Breed wiki link:', breedWikiLink.href);
    
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
        votingBtns.style.display = 'none';
        loading.style.display = 'block';
        catImage.style.display = 'none';
    }

    function hideLoading() {
        loading.style.display = 'none';
        catImage.style.display = 'block';
        votingBtns.style.display = 'flex';
    }

    function updateViewButtons() {
        gridViewBtn.classList.toggle('active', currentView === 'grid');
        listViewBtn.classList.toggle('active', currentView === 'list');
    }
    

    function loadFavorites() {
        const favsContainer = document.getElementById('favs-container');
        favsContainer.innerHTML = '';
        
        // Set container to be scrollable
        favsContainer.className = 'h-[450px] overflow-y-auto p-4';
        
        const innerContainer = document.createElement('div');
        innerContainer.className = currentView === 'grid' 
            ? 'grid grid-cols-3 gap-1.5'  // Changed to 2 columns
            : 'flex flex-col space-y-4';
        favsContainer.appendChild(innerContainer);
        
        fetch('api/favorites')
            .then(response => response.json())
            .then(favorites => {
                const uniqueFavorites = Array.from(new Set(favorites.map(fav => fav.image.url)))
                    .map(url => favorites.find(fav => fav.image.url === url));
                
                if (uniqueFavorites.length > 0) {
                    uniqueFavorites.forEach(fav => {
                        const favDiv = document.createElement('div');
                        
                        if (currentView === 'grid') {
                            favDiv.classList.add(
                                'favorite-cat',
                                'border',
                                
                                'bg-white',
                                'shadow-md',
                                'overflow-hidden'  // Added for image containment
                            );
                        } else {
                            favDiv.classList.add(
                                'favorite-cat',
                                'flex',
                                'items-center',
                                'p-4',
                                'border',
                               
                                'bg-white',
                                'shadow-md'
                            );
                        }
    
                        const imageContainer = document.createElement('div');
                        imageContainer.classList.add(
                            currentView === 'list' ? 'w-48' : 'w-full',
                            'flex-shrink-0'
                        );
    
                        const favImage = document.createElement('img');
                        favImage.src = fav.image.url;
                        favImage.alt = 'Favorite Cat';
                        if (currentView === 'grid') {
                            favImage.classList.add('w-full', 'h-64', 'object-cover');  // Fixed height for grid view
                        } else {
                            favImage.classList.add('w-full', 'h-32',  'object-cover');
                        }
                        imageContainer.appendChild(favImage);
    
                        const contentContainer = document.createElement('div');
                        if (currentView === 'list') {
                            contentContainer.classList.add('flex-1', 'ml-4');
                        } else {
                            contentContainer.classList.add('p-4');  // Added padding for grid view
                        }
    
                        const removeBtn = document.createElement('button');
                        removeBtn.classList.add(
                            'remove-fav-btn',
                            'px-4',
                            'py-2',
                            'bg-red-500',
                            'text-white',
                            'rounded-lg',
                            'hover:bg-red-600',
                            'transition-colors',
                            'w-full'  // Make button full width in grid view
                        );
                        removeBtn.textContent = 'Remove';
                        removeBtn.dataset.favoriteId = fav.id;
                        removeBtn.onclick = () => removeFromFavorites(fav.id);
    
                        contentContainer.appendChild(removeBtn);
                        favDiv.appendChild(imageContainer);
                        favDiv.appendChild(contentContainer);
                        innerContainer.appendChild(favDiv);
                    });
                } else {
                    innerContainer.innerHTML = '<p class="text-center text-gray-500">No favorites yet.</p>';
                }
            })
            .catch(error => {
                console.error('Error loading favorites:', error);
                innerContainer.innerHTML = '<p class="text-center text-red-500">Error loading favorites.</p>';
            });
    }

    function removeFromFavorites(favoriteID) {
        fetch(`/api/favorites/${favoriteID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    console.log('Favorite removed successfully');
                    loadFavorites(); // Reload favorites after removal
                } else {
                    console.error('Error:', result.error);
                }
            })
            .catch(error => {
                console.error('Error removing favorite:', error);
            });
    }
    

    function addCatToFavorites() {
        const catData = {
            image_id: currentImageId
        };
    
        fetch('/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(catData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add cat to favorites');
            }
            return response.json();
        })
        .then(data => {
            console.log('Cat added to favorites on server:', data);
        })
        .catch(error => {
            console.error('Error adding cat to favorites:', error);
        });
    }

    // Function to post vote to the Beego server
async function postVote(voteValue) {
    const imageId = currentImageId; // Get the current image ID
    const subId = "user-123"; // Replace with the actual user ID or leave it empty if not required

    const voteData = {
        image_id: imageId,
        sub_id: subId,
        value: voteValue, // 1 for like, -1 for dislike
    };

    try {
        const response = await fetch('/api/vote', {  // API endpoint for your Beego server
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(voteData),
        });

        console.log(response);

        if (!response.ok) {
            throw new Error('Failed to post vote');
        }

        // If vote is successfully posted, load a new cat image for voting
        loadNewCatForVoting();
    } catch (error) {
        console.error('Error posting vote:', error);
        // Optionally, handle errors such as showing an alert to the user
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

