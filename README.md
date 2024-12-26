# 🐱 Cat API Application

A modern, Go-based web application powered by The Cat API that lets cat enthusiasts explore, vote on, and collect their favorite cat images. Built with the Beego framework, this application offers a responsive interface with comprehensive breed information and interactive features.

## 📌 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features
- 🖼️ Display random cat images
- 🔍 Browse and search cats by breed
- ℹ️ Detailed breed information and characteristics
- 👍 Interactive voting system (like/dislike)
- ⭐ Personalized favorites collection
- 📱 Responsive design for all devices
- 🎯 Grid/List view toggle for favorites

## 🛠️ Tech Stack
- **Backend**: Go 1.23+
- **Framework**: Beego v2.3.4
- **API**: The Cat API
- **Frontend**: HTML5, CSS3, JavaScript
- **Testing**: Go testing package

## 📁 Project Structure
```
catapi-app/
├── conf/
│   └── app.conf         # Application configuration
├── controllers/
│   └── default.go       # Main controller logic
├── models/
│   └── cat.go          # Data models
├── routers/
│   └── router.go       # URL routing configuration
├── static/
│   ├── css/
│   │   └── styles.css  # Custom styles
│   └── js/
│       └── app.js      # Frontend JavaScript
├── tests/
│   └── default_test.go # Test cases
├── views/
│   └── index.tpl       # Main template
└── main.go             # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Go 1.23 or higher
- Git
- API key from [The Cat API](https://thecatapi.com/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/uzzalcse/catapi-app.git
cd catapi-app
```

2. Install dependencies:
```bash
go mod tidy
```

### Configuration

1. Create a configuration file at `conf/app.conf`:
```ini
appname = catapi-app
httpport = 8080
runmode = dev
cat_api_key = your_api_key_here
api_base_url = https://api.thecatapi.com/v1
```

2. Start the server:
```bash
go run main.go
```

The application will be available at 
http://localhost:8080/

## 🔌 API Endpoints

### Cat Operations
```
GET    /api/cat              # Get a random cat image
GET    /api/breeds           # List all cat breeds
GET    /api/breeds/:id       # Get breed information
GET    /api/breeds/:id/search # Search cats by breed
```

### User Interactions
```
POST   /api/vote             # Vote on a cat image
GET    /api/votes            # Get voting history
GET    /api/favorites        # List favorite cats
POST   /api/favorites        # Add cat to favorites
DELETE /api/favorites/:id    # Remove from favorites
```

## 🧪 Testing

Run all tests:
```bash
go test -v ./tests
```

Generate coverage report:
```bash
go test ./... -cover
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out -o coverage.html
```

View coverage in terminal:
```bash
go tool cover -func=coverage.out
```

## API responses in browser 

Get all votes order by descending order

http://localhost:8080/api/votes?order=DESC

Get latest 10 votes

http://localhost:8080/api/votes?limit=10&order=DESC


Get all votes of with the sub_id

http://localhost:8080/api/votes?sub_id=user-123

Get favorites from api 

http://localhost:8080/api/favorites


## 📚 API Reference
This project uses [The Cat API](https://thecatapi.com/). To get started:
1. Sign up at [https://thecatapi.com/](https://thecatapi.com/)
2. Get your API key
3. Add the key to your configuration file

## 🤝 Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.