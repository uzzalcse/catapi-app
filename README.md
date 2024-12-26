# Beego Cat API Application

This is a simple web application built using the Beego framework that interacts with a cat API.

## Project Structure

```
catapi-app/
├── conf/
├── controllers/
├── models/
├── routers/
├── static/
├── tests/
├── views/
└── main.go
```

## Features

- Fetch cat data from an external API
- Display cat information
- RESTful API endpoints
- MVC architecture using Beego framework

## Requirements

- Go 1.16 or higher
- Beego framework
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/catapi-app.git
```

2. Install dependencies:
```bash
go mod tidy
```

3. Run the application:
```bash
bee run
```

## API Endpoints

- `GET /api/cats` - Get all cats
- `GET /api/cats/:id` - Get cat by ID

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.