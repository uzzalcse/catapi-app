<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Gallery</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-center mb-8">Cat Gallery</h1>
        
        <div class="flex justify-between items-center mb-8">
            <div class="w-64">
                <select id="breed-select" class="w-full p-2 border rounded-lg">
                    <option value="">All Breeds</option>
                </select>
            </div>
            
            <button id="refresh-btn" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Refresh Cats
            </button>
        </div>
        
        <div id="loading" class="text-center hidden">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
        
        <div id="error" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span id="error-message"></span>
        </div>
        
        <div id="cat-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        
        <div class="text-center mt-8">
            <button id="load-more" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
                Load More
            </button>
        </div>
    </div>
    <script src="/static/js/app.js"></script>
</body>
</html>