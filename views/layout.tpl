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