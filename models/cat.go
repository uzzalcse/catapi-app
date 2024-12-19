// models/cat.go
package models

type Cat struct {
    ID      string  `json:"id"`
    URL     string  `json:"url"`
    Width   int     `json:"width"`
    Height  int     `json:"height"`
    Breeds  []Breed `json:"breeds"`
}

type Breed struct {
    ID           string `json:"id"`
    Name         string `json:"name"`
    Description  string `json:"description"`
    Temperament  string `json:"temperament"`
    Origin       string `json:"origin"`
    WikipediaURL string `json:"wikipedia_url"`
}