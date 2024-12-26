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
<body class="breeds min-h-screen bg-gray-50 p-4 flex items-center justify-center">
    <div class="container max-w-xl mx-auto">
        <div class="w-full bg-white rounded-2xl shadow-lg overflow-hidden h-[675px] flex flex-col">
            <!-- Tab Navigation -->
            <div class="tabs flex border-b justify-start">
                <button  id="voting-tab" class="tab-btn active flex items-center gap-2 px-6 py-4 text-orange-500 border-b-2 border-orange-500">
                    
                    <i class="fa-solid fa-arrows-up-down"></i>
                    <span>Voting</span>
                </button>
                <button id="breeds-tab" class="tab-btn flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-search"></i>
                    <span>Breeds</span>
                </button>
                <button id="favs-tab" class="tab-btn flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-heart"></i>
                    <span>Favs</span>
                </button>
            </div>

            <!-- Breeds Section -->
            <div id="breeds-section" class="hidden p-4">
                <select id="breed-select" class="w-full px-4 py-2 pr-12 text-lg border rounded-xl appearance-none focus:border-blue-500">

                </select>

                <div id="breed-image-container" class="mt-4 text-center">
                    <img id="breed-cat-image" style="height:250px" src="" alt="Breed Cat" class="w-full h-[400px] object-cover rounded-lg px-20" style="display:none;" />
                </div>

                <div id="carousel-dots" class="flex justify-center mt-2 space-x-2">
                    <!-- Dots will be dynamically added here -->
                </div>

                <div id="breed-details" class="mt-4">
                    <span id="breed-name" class="font-semibold text-lg"></span>
                    <span id="breed-origin"></span>
                    <span id="breed-id" class="text-gray-500"></span>
                    <p id="breed-description" class="text-gray-700 mt-2"></p>
                    <a id="breed-wiki-link" class="text-orange-500 hover:underline">WIKIPEDIA</a>
                </div>
            </div>

            <!-- Cat Image Section -->
<div id="cat-display" class="cat-container relative h-full w-full">
    <div id="loading" class="hidden absolute  flex items-center justify-center bg-white/75 h-full w-full">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>

    <div class="flex flex-col h-full">
        <div id="cat-image-section" style="display: flex; justify-content: center; align-items: center; flex-grow: 1; height: 100%;">
            <img id="cat-image" src="" alt="Cat" class="w-full h-[400px] object-cover">
        </div>
        
        <div id="voting-btns" class="action-buttons flex justify-between items-center px-4 py-3 pt-0">
            <button id="favorite-btn" class="action-btn">
                <i class="far fa-heart text-2xl"></i>
            </button>
            <div class="flex gap-8">
                <button id="like-btn" class="action-btn">
                    <i class="far fa-thumbs-up text-2xl"></i>
                </button>
                <button id="dislike-btn" class="action-btn">
                    <i class="far fa-thumbs-down text-2xl"></i>
                </button>
            </div>
        </div>
    </div>
</div>

            <!-- Favs Section -->
            <div id="favs-section" class="hidden p-4 h-[500px]">
                <div class="flex justify-start mb-4">
                    <button id="grid-view-btn" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 mr-2 flex items-center" title="Grid View">
                        <i class="fa fa-th mr-2"></i> Grid View
                    </button>
                    <button id="list-view-btn" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 flex items-center" title="List View">
                        <i class="fa fa-list mr-2"></i> List View
                    </button>
                </div>

                <div id="favs-container" class="grid grid-cols-2 gap-4 ">
                    <!-- Favorite images will be inserted here dynamically -->
                </div>
            </div>
        </div>
    </div>

    <script src="/static/js/app.js"></script>
</body>
</html>