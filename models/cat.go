// models/cat.go
package models

type Cat struct {
    ID     string `json:"id"`
    URL    string `json:"url"`
    Breeds []struct {
        ID   string `json:"id"`
        Name string `json:"name"`
    } `json:"breeds"`
}

type Breed struct {
    ID           string `json:"id"`
    Name         string `json:"name"`
    Description  string `json:"description"`
    Temperament  string `json:"temperament"`
    Origin       string `json:"origin"`
}

type Vote struct {
    ImageID string `json:"image_id"`
    Value   int    `json:"value"` // 1 for like, -1 for dislike
}



type BreedImage struct {
	ID     string `json:"id"`
	URL    string `json:"url"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
	Breeds []Breed `json:"breeds"`
}

type Image struct {
    ID  string `json:"id"`
    URL string `json:"url"`
}

// Favorite structure for each favorite with a nested image field
type Favorite struct {
    ID        int    `json:"id"`
    ImageID   string `json:"image_id"`
    SubID     string `json:"sub_id"` // SubID can be null
    CreatedAt string `json:"created_at"`
    Image     Image  `json:"image"` // Nested Image field
}

// Model for the response when fetching favorites
type FavoritesResponse struct {
    Favourites []Favorite `json:"favourites"`
}