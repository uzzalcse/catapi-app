<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Browser</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <div class="tabs flex justify-center space-x-4 mb-8">
            <button id="voting-tab" class="tab-btn active">
                <i class="fas fa-arrow-up-arrow-down"></i>
                <span>Voting</span>
            </button>
            <button id="breeds-tab" class="tab-btn">
                <i class="fas fa-search"></i>
                <span>Breeds</span>
            </button>
            <button id="favs-tab" class="tab-btn">
                <i class="fas fa-heart"></i>
                <span>Favs</span>
            </button>
        </div>

        <!-- Breeds Section -->
        <div id="breeds-section" class="mb-8 hidden">
            <select id="breed-select" class="w-full max-w-xs mx-auto block p-2 border rounded-lg">
                <option value="">Select Breed</option>
            </select>

            <!-- Single Breed Image Container -->
            <div id="breed-image-container" class="mt-4 text-center w-1/2 mx-auto overflow-hidden h-[400px]">
                <img id="breed-cat-image" src="" alt="Breed Cat" class="mx-auto contain" style="display:none;" />
            </div>

            <!-- Carousel Dots for manual navigation -->
            <div id="carousel-dots" class="flex justify-center mt-2 space-x-2">
                <!-- Dots will be dynamically added here -->
            </div>

            <div id="breed-details" class="mt-4">
                <p id="breed-name" class="font-semibold text-lg"></p>
                <p id="breed-id" class="text-gray-500"></p>
                <p id="breed-description" class="text-gray-700 mt-2"></p>
                <a id="breed-wiki-link">Wikipedia</a>
            </div>
        </div>

        <!-- Cat Image Section -->
        <div id="cat-display" class="cat-container max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div id="loading" class="hidden">
                <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>

            <div id="cat-image-section" class="relative">
                <img id="cat-image" src="" alt="Cat" class="w-full object-cover">
                <div class="action-buttons absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                    <button id="dislike-btn" class="action-btn bg-white p-3 rounded-full shadow-lg">
                        <i class="fas fa-thumbs-down text-red-500"></i>
                    </button>
                    <button id="favorite-btn" class="action-btn bg-white p-3 rounded-full shadow-lg animate-pulse">
                        <i class="fas fa-heart text-gray-400"></i>
                    </button>
                    <button id="like-btn" class="action-btn bg-white p-3 rounded-full shadow-lg">
                        <i class="fas fa-thumbs-up text-green-500"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Favs Section -->
        <div id="favs-section" class="mb-8 hidden">
            <!-- View Toggle -->
            <div class="flex justify-start mb-4">
                <button id="grid-view-btn" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 mr-2 flex items-center" title="Grid View">
                    <i class="fa fa-th mr-2"></i> Grid View
                </button>
                <button id="list-view-btn" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 flex items-center" title="List View">
                    <i class="fa fa-list mr-2"></i> List View
                </button>
            </div>

            <!-- Favorites Container (Initially Grid Layout) -->
            <div id="favs-container" class="grid grid-cols-2 gap-4">
                <!-- Favorite images will be inserted here dynamically -->
            </div>
        </div>
    </div>

    <script src="/static/js/app.js"></script>
</body>
</html>
