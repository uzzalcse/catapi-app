package controllers

import (
	"bytes"
	"catapi-app/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	beego "github.com/beego/beego/v2/server/web"
)

// FavoriteController handles favorite-related endpoints.
type FavoriteController struct {
	beego.Controller
}

// AddToFavorite adds an image to the user's favorites.
func (c *FavoriteController) AddToFavorite() {
	var favoriteReq struct {
		ImageID string `json:"image_id"`
	}

	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &favoriteReq); err != nil {
		c.Ctx.ResponseWriter.WriteHeader(http.StatusBadRequest)
		c.Data["json"] = map[string]string{"error": "Invalid request payload"}
		c.ServeJSON()
		return
	}

	favChan := make(chan models.Favorite)
	errChan := make(chan error)

	go func() {
		subID := "user-123"
		apiKey, _ := beego.AppConfig.String("cat_api_key")
		apiURL, _ := beego.AppConfig.String("api_base_url")

		body, _ := json.Marshal(map[string]string{
			"image_id": favoriteReq.ImageID,
			"sub_id":   subID,
		})

		req, err := http.NewRequest("POST", fmt.Sprintf("%s/favourites", apiURL), bytes.NewBuffer(body))
		if err != nil {
			errChan <- err
			return
		}

		req.Header.Add("x-api-key", apiKey)
		req.Header.Add("Content-Type", "application/json")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			errChan <- err
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			errChan <- fmt.Errorf("failed to add to favorites")
			return
		}

		var favoriteResp models.Favorite
		if err := json.NewDecoder(resp.Body).Decode(&favoriteResp); err != nil {
			errChan <- err
			return
		}

		favChan <- favoriteResp
	}()

	select {
	case favorite := <-favChan:
		c.Data["json"] = favorite
		c.ServeJSON()
	case err := <-errChan:
		c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
		c.Data["json"] = map[string]string{"error": err.Error()}
		c.ServeJSON()
	}
}

// GetFavorites retrieves all favorite images for the user.
func (c *FavoriteController) GetFavorites() {
	favsChan := make(chan []models.Favorite)
	errChan := make(chan error)

	go func() {
		apiKey, _ := beego.AppConfig.String("cat_api_key")
		apiURL, _ := beego.AppConfig.String("api_base_url")

		req, err := http.NewRequest("GET", fmt.Sprintf("%s/favourites", apiURL), nil)
		if err != nil {
			errChan <- err
			return
		}

		req.Header.Add("x-api-key", apiKey)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			errChan <- fmt.Errorf("failed to fetch favorites: %v", err)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			errChan <- fmt.Errorf("failed to fetch favorites")
			return
		}

		var favorites []models.Favorite
		if err := json.NewDecoder(resp.Body).Decode(&favorites); err != nil {
			errChan <- fmt.Errorf("invalid response from server: %v", err)
			return
		}

		favsChan <- favorites
	}()

	select {
	case favorites := <-favsChan:
		c.Data["json"] = favorites
		c.ServeJSON()
	case err := <-errChan:
		c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
		c.Data["json"] = map[string]string{"error": err.Error()}
		c.ServeJSON()
	}
}

// RemoveFromFavorite removes a favorite image by its ID.
func (c *FavoriteController) RemoveFromFavorite() {
	favoriteID := c.Ctx.Input.Param(":favorite_id")
	if favoriteID == "" {
		c.Ctx.ResponseWriter.WriteHeader(http.StatusBadRequest)
		c.Data["json"] = map[string]string{"error": "favorite_id is required"}
		c.ServeJSON()
		return
	}

	statusChan := make(chan string)
	errChan := make(chan error)

	go func() {
		apiKey, _ := beego.AppConfig.String("cat_api_key")
		if apiKey == "" {
			errChan <- fmt.Errorf("API key is missing")
			return
		}

		apiURL, _ := beego.AppConfig.String("api_base_url")
		if apiURL == "" {
			errChan <- fmt.Errorf("base API URL is missing")
			return
		}

		deleteURL := fmt.Sprintf("%s/favourites/%s", apiURL, favoriteID)
		req, err := http.NewRequest("DELETE", deleteURL, nil)
		if err != nil {
			errChan <- fmt.Errorf("failed to create request: %v", err)
			return
		}

		req.Header.Add("x-api-key", apiKey)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			errChan <- fmt.Errorf("failed to contact API: %v", err)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			body, _ := io.ReadAll(resp.Body)
			errChan <- fmt.Errorf("%s", string(body))
			return
		}

		statusChan <- "success"
	}()

	select {
	case status := <-statusChan:
		c.Data["json"] = map[string]string{"status": status}
		c.ServeJSON()
	case err := <-errChan:
		c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
		c.Data["json"] = map[string]string{"error": err.Error()}
		c.ServeJSON()
	}
}
