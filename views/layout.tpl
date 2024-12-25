<!DOCTYPE html>
<html>
<head>
    <title>Cat API Gallery</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
    {{.LayoutContent}}
    <script src="/static/js/main.js"></script>
</body>
</html>

# Index Template (views/index.tpl)
<div class="container">
    <h1>Cat Gallery</h1>
    <div id="breed-filter">
        <select id="breed-select">
            <option value="">All Breeds</option>
        </select>
    </div>
    <div id="cat-grid" class="grid"></div>
    <button id="load-more">Load More Cats</button>
</div>




<!DOCTYPE html>
<html lang="en">
<!-- Head section remains unchanged -->
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Browser</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body class="breeds min-h-screen bg-gray-50 p-4 flex items-center justify-center">
    <div class="container max-w-md mx-auto">
        <div class="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
            <!-- Tab Navigation -->
            <div class="tabs flex border-b">
                <button id="voting-tab" class="tab-btn flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-arrow-up-arrow-down"></i>
                    <span>Voting</span>
                </button>
                <button id="breeds-tab" class="tab-btn active flex items-center gap-2 px-6 py-4 text-orange-500 border-b-2 border-orange-500">
                    <i class="fas fa-search"></i>
                    <span>Breeds</span>
                </button>
                <button id="favs-tab" class="tab-btn flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-heart"></i>
                    <span>Favs</span>
                </button>
            </div>

            <!-- Breeds Section -->
            <div id="breeds-section" class="p-4">
                <div class="relative">
                    <select id="breed-select" class="w-full p-4 pr-12 text-lg border rounded-xl appearance-none">
                        <option value="">Abyssinian</option>
                    </select>
                    <button class="absolute right-4 top-1/2 -translate-y-1/2">
                        <i class="fas fa-times text-gray-400 hover:text-gray-600"></i>
                    </button>
                </div>

                <div id="breed-image-container" class="mt-6">
                    <img id="breed-cat-image" src="/placeholder.svg?height=400&width=600" alt="Breed Cat" class="w-full h-[400px] object-cover rounded-lg" />
                </div>

                <div id="carousel-dots" class="flex justify-center mt-4 space-x-2">
                    <button class="w-2 h-2 rounded-full bg-orange-500"></button>
                    <button class="w-2 h-2 rounded-full bg-gray-300"></button>
                    <button class="w-2 h-2 rounded-full bg-gray-300"></button>
                    <button class="w-2 h-2 rounded-full bg-gray-300"></button>
                    <button class="w-2 h-2 rounded-full bg-gray-300"></button>
                    <button class="w-2 h-2 rounded-full bg-gray-300"></button>
                    <button class="w-2 h-2 rounded-full bg-gray-300"></button>
                    <button class="w-2 h-2 rounded-full bg-gray-300"></button>
                </div>

                <div id="breed-details" class="mt-6">
                    <div class="flex items-center gap-2">
                        <span id="breed-name" class="text-xl font-medium">Abyssinian</span>
                        <span id="breed-origin" class="text-gray-500">(Egypt)</span>
                        <span id="breed-id" class="text-gray-400 text-sm">abys</span>
                    </div>
                    <p id="breed-description" class="text-gray-600 mt-4 leading-relaxed">
                        The Abyssinian is easy to care for, and a joy to have in your home. They're affectionate cats and love both people and other animals.
                    </p>
                    <a id="breed-wiki-link" class="inline-block mt-4 text-orange-500 font-medium hover:text-orange-600">
                        WIKIPEDIA
                    </a>
                </div>
            </div>

            <!-- Cat Image Section - remains unchanged -->
            <div id="cat-display" class="cat-container relative hidden">
                <!-- Content remains the same -->
            </div>

            <!-- Favs Section - remains unchanged -->
            <div id="favs-section" class="hidden p-4">
                <!-- Content remains the same -->
            </div>
        </div>
    </div>

    <script src="/static/js/app.js"></script>
</body>
</html>