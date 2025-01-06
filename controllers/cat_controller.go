package controllers

import (
	"catapi-app/models"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	beego "github.com/beego/beego/v2/server/web"
)

// CatController handles cat-related endpoints.
type CatController struct {
	beego.Controller
}

// GetRandomCat retrieves a random cat image.
func (c *CatController) GetRandomCat() {
	breedID := c.GetString("breed_id", "")

	catChan := make(chan models.Cat)
	errChan := make(chan error)

	go func() {
		apiKey, _ := beego.AppConfig.String("cat_api_key")
		baseURL, _ := beego.AppConfig.String("api_base_url")

		url := fmt.Sprintf("%s/images/search?limit=10", baseURL)
		if breedID != "" {
			url += "&breed_id=" + breedID
		}

		client := &http.Client{}
		req, err := http.NewRequest(http.MethodGet, url, nil)
		if err != nil {
			errChan <- err
			return
		}

		req.Header.Add("x-api-key", apiKey)
		resp, err := client.Do(req)
		if err != nil {
			errChan <- err
			return
		}
		defer resp.Body.Close()

		var cats []models.Cat
		if err := json.NewDecoder(resp.Body).Decode(&cats); err != nil {
			errChan <- err
			return
		}

		if len(cats) > 0 {
			catChan <- cats[0]
		} else {
			errChan <- fmt.Errorf("no cats found")
		}
	}()

	select {
	case cat := <-catChan:
		c.Data["json"] = cat
		c.ServeJSON()
	case err := <-errChan:
		c.CustomAbort(http.StatusInternalServerError, err.Error())
	}
}

// GetBreeds retrieves all cat breeds.
func (c *CatController) GetBreeds() {
	breedsChan := make(chan []models.Breed)
	errChan := make(chan error)

	go func() {
		apiKey, _ := beego.AppConfig.String("cat_api_key")
		baseURL, _ := beego.AppConfig.String("api_base_url")

		client := &http.Client{}
		req, err := http.NewRequest(http.MethodGet, baseURL+"/breeds", nil)
		if err != nil {
			errChan <- err
			return
		}

		req.Header.Add("x-api-key", apiKey)
		resp, err := client.Do(req)
		if err != nil {
			errChan <- err
			return
		}
		defer resp.Body.Close()

		var breeds []models.Breed
		if err := json.NewDecoder(resp.Body).Decode(&breeds); err != nil {
			errChan <- err
			return
		}

		breedsChan <- breeds
	}()

	select {
	case breeds := <-breedsChan:
		c.Data["json"] = breeds
		c.ServeJSON()
	case err := <-errChan:
		c.CustomAbort(http.StatusInternalServerError, err.Error())
	}
}

// GetBreedImages retrieves images of a specific breed.
func (c *CatController) GetBreedImages() {
	errChan := make(chan error)
	imagesChan := make(chan []models.BreedImage)

	breedID := c.GetString(":breed_id")
	if breedID == "" {
		c.CustomAbort(http.StatusBadRequest, "breed_id is required")
		return
	}

	apiKey, _ := beego.AppConfig.String("cat_api_key")
	apiURL, _ := beego.AppConfig.String("api_base_url")
	url := fmt.Sprintf("%s/images/search?breed_ids=%s&limit=8", apiURL, breedID)

	go func() {
		req, err := http.NewRequest(http.MethodGet, url, nil)
		if err != nil {
			errChan <- err
			return
		}

		req.Header.Add("x-api-key", apiKey)
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			errChan <- err
			return
		}
		defer resp.Body.Close()

		var images []models.BreedImage
		if err := json.NewDecoder(resp.Body).Decode(&images); err != nil {
			errChan <- err
			return
		}

		imagesChan <- images
	}()

	select {
	case images := <-imagesChan:
		c.Data["json"] = images
		c.ServeJSON()
	case err := <-errChan:
		c.CustomAbort(http.StatusInternalServerError, err.Error())
	case <-time.After(10 * time.Second):
		c.CustomAbort(http.StatusGatewayTimeout, "request timed out")
	}
}

// GetBreedInfo retrieves information about a specific breed.
func (c *CatController) GetBreedInfo() {
	errChan := make(chan error)
	breedChan := make(chan models.Breed)

	breedID := c.GetString(":breed_id")
	if breedID == "" {
		c.CustomAbort(http.StatusBadRequest, "breed_id is required")
		return
	}

	apiKey, _ := beego.AppConfig.String("cat_api_key")
	apiURL, _ := beego.AppConfig.String("api_base_url")
	url := fmt.Sprintf("%s/breeds/%s", apiURL, breedID)

	go func() {
		req, err := http.NewRequest(http.MethodGet, url, nil)
		if err != nil {
			errChan <- err
			return
		}

		req.Header.Add("x-api-key", apiKey)
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			errChan <- err
			return
		}
		defer resp.Body.Close()

		var breed models.Breed
		if err := json.NewDecoder(resp.Body).Decode(&breed); err != nil {
			errChan <- err
			return
		}

		breedChan <- breed
	}()

	select {
	case breed := <-breedChan:
		c.Data["json"] = breed
		c.ServeJSON()
	case err := <-errChan:
		c.CustomAbort(http.StatusInternalServerError, err.Error())
	case <-time.After(10 * time.Second):
		c.CustomAbort(http.StatusGatewayTimeout, "request timed out")
	}
}
