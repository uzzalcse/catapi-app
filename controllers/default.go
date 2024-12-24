package controllers

import (
	"bytes"
	"catapi-app/models"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	beego "github.com/beego/beego/v2/server/web"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.TplName = "index.tpl"
}

func (c *MainController) GetRandomCat() {
	breedId := c.GetString("breed_id", "")

	catChan := make(chan models.Cat)
	errChan := make(chan error)

	go func() {
		apiKey, _ := beego.AppConfig.String("cat_api_key")
		baseURL, _ := beego.AppConfig.String("api_base_url")

		url := fmt.Sprintf("%s/images/search?limit=10", baseURL)
		if breedId != "" {
			url += "&breed_id=" + breedId
		}

		client := &http.Client{}
		req, err := http.NewRequest("GET", url, nil)
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
		c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
		c.Data["json"] = map[string]string{"error": err.Error()}
		c.ServeJSON()
	}
}

func (c *MainController) GetBreeds() {
	breedsChan := make(chan []models.Breed)
	errChan := make(chan error)

	go func() {
		apiKey, _ := beego.AppConfig.String("cat_api_key")
		baseURL, _ := beego.AppConfig.String("api_base_url")

		client := &http.Client{}
		req, err := http.NewRequest("GET", baseURL+"/breeds", nil)
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
		c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
		c.Data["json"] = map[string]string{"error": err.Error()}
		c.ServeJSON()
	}
}


// func (c *MainController) Vote() {
//     var vote models.Vote

//     // Unmarshal request body into vote struct
//     if err := json.Unmarshal(c.Ctx.Input.RequestBody, &vote); err != nil {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusBadRequest)
//         c.Data["json"] = map[string]string{"error": err.Error()}
//         c.ServeJSON()
//         return
//     }

//     // Validate the input data
//     if vote.ImageID == "" || (vote.Value != 1 && vote.Value != -1) {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusBadRequest)
//         c.Data["json"] = map[string]string{"error": "Invalid image_id or value"}
//         c.ServeJSON()
//         return
//     }

//     // Get API Key and Base URL from config
//     apiKey, err := beego.AppConfig.String("cat_api_key")
//     if err != nil || apiKey == "" {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.Data["json"] = map[string]string{"error": "Missing API key"}
//         c.ServeJSON()
//         return
//     }
//     baseURL, err := beego.AppConfig.String("api_base_url")
//     if err != nil || baseURL == "" {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.Data["json"] = map[string]string{"error": "Missing Base URL"}
//         c.ServeJSON()
//         return
//     }

//     // Prepare the request body
//     body, _ := json.Marshal(vote)
// 	log.Println("vote", vote)
//     req, err := http.NewRequest("POST", baseURL+"/votes", bytes.NewBuffer(body))
//     if err != nil {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.Data["json"] = map[string]string{"error": "Error creating request"}
//         c.ServeJSON()
//         return
//     }

//     // Set headers for the request
//     req.Header.Add("x-api-key", apiKey)
//     req.Header.Add("Content-Type", "application/json")

//     // Initialize HTTP client
//     client := &http.Client{}
//     resp, err := client.Do(req)
//     if err != nil {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.Data["json"] = map[string]string{"error": err.Error()}
//         c.ServeJSON()
//         return
//     }
//     defer resp.Body.Close()

//     // Handle response status codes
//     if resp.StatusCode < 200 || resp.StatusCode >= 300 {
//         body, _ := ioutil.ReadAll(resp.Body)
//         c.Ctx.ResponseWriter.WriteHeader(resp.StatusCode)
//         c.Data["json"] = map[string]string{"error": string(body)}
//         c.ServeJSON()
//         return
//     }

//     // Return success message
//     body, _ = ioutil.ReadAll(resp.Body)
//     c.Data["json"] = map[string]string{"status": "success", "response": string(body)}
//     c.ServeJSON()
// }


func (c *MainController) Vote() {
    var vote models.Vote
    
    // Unmarshal request body into vote struct
    if err := json.Unmarshal(c.Ctx.Input.RequestBody, &vote); err != nil {
        c.Ctx.ResponseWriter.WriteHeader(http.StatusBadRequest)
        c.Data["json"] = map[string]string{"error": err.Error()}
        c.ServeJSON()
        return
    }

    // Validate the input data
    if vote.ImageID == "" || (vote.Value != 1 && vote.Value != -1) {
        c.Ctx.ResponseWriter.WriteHeader(http.StatusBadRequest)
        c.Data["json"] = map[string]string{"error": "Invalid image_id or value"}
        c.ServeJSON()
        return
    }

    respChan := make(chan string)
    errChan := make(chan error)

    go func() {
        apiKey, err := beego.AppConfig.String("cat_api_key")
        if err != nil || apiKey == "" {
            errChan <- fmt.Errorf("missing API key")
            return
        }
        
        baseURL, err := beego.AppConfig.String("api_base_url")
        if err != nil || baseURL == "" {
            errChan <- fmt.Errorf("missing Base URL")
            return
        }

        body, _ := json.Marshal(vote)
        req, err := http.NewRequest("POST", baseURL+"/votes", bytes.NewBuffer(body))
        if err != nil {
            errChan <- fmt.Errorf("error creating request: %v", err)
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

        responseBody, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            errChan <- err
            return
        }

        if resp.StatusCode < 200 || resp.StatusCode >= 300 {
            errChan <- fmt.Errorf("%s", string(responseBody))
            return
        }

        respChan <- string(responseBody)
    }()

    select {
    case response := <-respChan:
        c.Data["json"] = map[string]string{"status": "success", "response": response}
        c.ServeJSON()
    case err := <-errChan:
        c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
        c.Data["json"] = map[string]string{"error": err.Error()}
        c.ServeJSON()
    }
}


// func (c *MainController) GetBreedImages() {
// 	breedID := c.GetString(":breed_id")
// 	if breedID == "" {
// 		c.Data["json"] = map[string]interface{}{
// 			"error": "breed_id is required",
// 		}
// 		c.ServeJSON()
// 		return
// 	}

// 	apiKey, _ := beego.AppConfig.String("cat_api_key")
// 	apiURL, _ := beego.AppConfig.String("api_base_url")

// 	// Create search URL with limit=8
// 	url := fmt.Sprintf("%s/images/search?breed_ids=%s&limit=8", apiURL, breedID)

// 	req, err := http.NewRequest("GET", url, nil)
// 	if err != nil {
// 		c.Data["json"] = map[string]interface{}{"error": err.Error()}
// 		c.ServeJSON()
// 		return
// 	}

// 	req.Header.Add("x-api-key", apiKey)
// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		c.Data["json"] = map[string]interface{}{"error": err.Error()}
// 		c.ServeJSON()
// 		return
// 	}
// 	defer resp.Body.Close()

// 	body, err := ioutil.ReadAll(resp.Body)
// 	if err != nil {
// 		c.Data["json"] = map[string]interface{}{"error": err.Error()}
// 		c.ServeJSON()
// 		return
// 	}

// 	var images []models.BreedImage
// 	err = json.Unmarshal(body, &images)
// 	if err != nil {
// 		c.Data["json"] = map[string]interface{}{"error": err.Error()}
// 		c.ServeJSON()
// 		return
// 	}

// 	c.Data["json"] = images
// 	c.ServeJSON()
// }

func (c *MainController) GetBreedImages() {
    errChan := make(chan error)
    imagesChan := make(chan []models.BreedImage)

    breedID := c.GetString(":breed_id")
    if breedID == "" {
        c.Data["json"] = map[string]interface{}{
            "error": "breed_id is required",
        }
        c.ServeJSON()
        return
    }

    apiKey, _ := beego.AppConfig.String("cat_api_key")
    apiURL, _ := beego.AppConfig.String("api_base_url")
    url := fmt.Sprintf("%s/images/search?breed_ids=%s&limit=8", apiURL, breedID)

    go func() {
        req, err := http.NewRequest("GET", url, nil)
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

        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            errChan <- err
            return
        }

        var images []models.BreedImage
        err = json.Unmarshal(body, &images)
        if err != nil {
            errChan <- err
            return
        }

        imagesChan <- images
    }()

    select {
    case err := <-errChan:
        c.Data["json"] = map[string]interface{}{"error": err.Error()}
        c.ServeJSON()
    case images := <-imagesChan:
        c.Data["json"] = images
        c.ServeJSON()
    case <-time.After(10 * time.Second): // Adding timeout
        c.Data["json"] = map[string]interface{}{"error": "request timed out"}
        c.ServeJSON()
    }
}

// func (c *MainController) GetBreedInfo() {
// 	breedID := c.GetString(":breed_id")
// 	if breedID == "" {
// 		c.Data["json"] = map[string]interface{}{
// 			"error": "breed_id is required",
// 		}
// 		c.ServeJSON()
// 		return
// 	}

// 	apiKey, _ := beego.AppConfig.String("cat_api_key")
// 	apiURL, _ := beego.AppConfig.String("api_base_url")

// 	url := fmt.Sprintf("%s/breeds/%s", apiURL, breedID)

// 	req, err := http.NewRequest("GET", url, nil)
// 	if err != nil {
// 		c.Data["json"] = map[string]interface{}{"error": err.Error()}
// 		c.ServeJSON()
// 		return
// 	}

// 	req.Header.Add("x-api-key", apiKey)
// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		c.Data["json"] = map[string]interface{}{"error": err.Error()}
// 		c.ServeJSON()
// 		return
// 	}
// 	defer resp.Body.Close()

// 	body, err := ioutil.ReadAll(resp.Body)
// 	if err != nil {
// 		c.Data["json"] = map[string]interface{}{"error": err.Error()}
// 		c.ServeJSON()
// 		return
// 	}

// 	var breed models.Breed
// 	err = json.Unmarshal(body, &breed)
// 	if err != nil {
// 		c.Data["json"] = map[string]interface{}{"error": err.Error()}
// 		c.ServeJSON()
// 		return
// 	}

// 	c.Data["json"] = breed
// 	c.ServeJSON()
// }


func (c *MainController) GetBreedInfo() {
    errChan := make(chan error)
    breedChan := make(chan models.Breed)

    breedID := c.GetString(":breed_id")
    if breedID == "" {
        c.Data["json"] = map[string]interface{}{
            "error": "breed_id is required",
        }
        c.ServeJSON()
        return
    }

    apiKey, _ := beego.AppConfig.String("cat_api_key")
    apiURL, _ := beego.AppConfig.String("api_base_url")
    url := fmt.Sprintf("%s/breeds/%s", apiURL, breedID)

    go func() {
        req, err := http.NewRequest("GET", url, nil)
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

        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            errChan <- err
            return
        }

        var breed models.Breed
        err = json.Unmarshal(body, &breed)
        if err != nil {
            errChan <- err
            return
        }

        breedChan <- breed
    }()

    select {
    case err := <-errChan:
        c.Data["json"] = map[string]interface{}{"error": err.Error()}
        c.ServeJSON()
    case breed := <-breedChan:
        c.Data["json"] = breed
        c.ServeJSON()
    case <-time.After(10 * time.Second): // Adding timeout
        c.Data["json"] = map[string]interface{}{"error": "request timed out"}
        c.ServeJSON()
    }
}



// AddToFavorite adds a cat image to the user's favorites
// func (c *MainController) AddToFavorite() {
// 	var favoriteReq struct {
// 		ImageID string `json:"image_id"`
// 	}
// 	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &favoriteReq); err != nil {
// 		c.Ctx.ResponseWriter.WriteHeader(http.StatusBadRequest)
// 		c.Data["json"] = map[string]string{"error": "Invalid request payload"}
// 		c.ServeJSON()
// 		return
// 	}

// 	// Hardcoded sub_id
// 	subID := "user-123"
// 	apiKey, _ := beego.AppConfig.String("cat_api_key")
// 	apiURL, _ := beego.AppConfig.String("api_base_url")

// 	// Prepare request body
// 	body, _ := json.Marshal(map[string]string{
// 		"image_id": favoriteReq.ImageID,
// 		"sub_id":   subID,
// 	})
// 	req, err := http.NewRequest("POST", fmt.Sprintf("%s/favourites", apiURL), bytes.NewBuffer(body))
// 	if err != nil {
// 		c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
// 		c.Data["json"] = map[string]string{"error": err.Error()}
// 		c.ServeJSON()
// 		return
// 	}

// 	req.Header.Add("x-api-key", apiKey)
// 	req.Header.Add("Content-Type", "application/json")

// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	if err != nil || resp.StatusCode != http.StatusOK {
// 		c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
// 		c.Data["json"] = map[string]string{"error": "Failed to add to favorites"}
// 		c.ServeJSON()
// 		return
// 	}
// 	defer resp.Body.Close()

// 	var favoriteResp models.Favorite
// 	if err := json.NewDecoder(resp.Body).Decode(&favoriteResp); err != nil {
// 		c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
// 		c.Data["json"] = map[string]string{"error": "Invalid response from server"}
// 		c.ServeJSON()
// 		return
// 	}

// 	c.Data["json"] = favoriteResp
// 	c.ServeJSON()
// }


func (c *MainController) AddToFavorite() {
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


// GetFavorites fetches all the user's favorites
// func (c *MainController) GetFavorites() {
//     apiKey, _ := beego.AppConfig.String("cat_api_key")
//     apiURL, _ := beego.AppConfig.String("api_base_url")

//     req, err := http.NewRequest("GET", fmt.Sprintf("%s/favourites", apiURL), nil)
//     if err != nil {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.Data["json"] = map[string]string{"error": err.Error()}
//         c.ServeJSON()
//         return
//     }

//     req.Header.Add("x-api-key", apiKey)

//     client := &http.Client{}
//     resp, err := client.Do(req)
//     if err != nil || resp.StatusCode != http.StatusOK {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.Data["json"] = map[string]string{"error": "Failed to fetch favorites"}
//         c.ServeJSON()
//         return
//     }
//     defer resp.Body.Close()

//     var favorites []models.Favorite
//     if err := json.NewDecoder(resp.Body).Decode(&favorites); err != nil {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.Data["json"] = map[string]string{"error": "Invalid response from server"}
//         c.ServeJSON()
//         return
//     }

//     c.Data["json"] = favorites
//     c.ServeJSON()
// }


func (c *MainController) GetFavorites() {
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


// func (c *MainController) RemoveFromFavorite() {
//     // Get the favorite_id from the URL parameter
//     favoriteID := c.Ctx.Input.Param(":favorite_id")
//     if favoriteID == "" {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusBadRequest)
//         c.Data["json"] = map[string]string{"error": "favorite_id is required"}
//         c.ServeJSON()
//         return
//     }

//     // Retrieve the API key and base URL from the configuration
//     apiKey, _ := beego.AppConfig.String("cat_api_key")
//     if apiKey == "" {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.Data["json"] = map[string]string{"error": "API key is missing"}
//         c.ServeJSON()
//         return
//     }

//     apiURL, _ := beego.AppConfig.String("api_base_url")
//     if apiURL == "" {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.Data["json"] = map[string]string{"error": "Base API URL is missing"}
//         c.ServeJSON()
//         return
//     }

//     // Create the DELETE request to remove the favorite from the Cat API
//     deleteURL := fmt.Sprintf("%s/favourites/%s", apiURL, favoriteID)
//     req, err := http.NewRequest("DELETE", deleteURL, nil)
//     if err != nil {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.Data["json"] = map[string]string{"error": "Failed to create request"}
//         c.ServeJSON()
//         return
//     }

//     req.Header.Add("x-api-key", apiKey)

//     // Perform the DELETE request to the Cat API
//     client := &http.Client{}
//     resp, err := client.Do(req)
//     if err != nil {
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.Data["json"] = map[string]string{"error": "Failed to contact API"}
//         c.ServeJSON()
//         return
//     }
//     defer resp.Body.Close()

//     // Check if the response status code is OK (200)
//     if resp.StatusCode != http.StatusOK {
//         c.Ctx.ResponseWriter.WriteHeader(resp.StatusCode)
        
//         // Read the response body to get a detailed error message
//         body, err := io.ReadAll(resp.Body)
//         if err != nil {
//             c.Data["json"] = map[string]string{"error": "Failed to read response body"}
//             c.ServeJSON()
//             return
//         }
        
//         c.Data["json"] = map[string]string{"error": string(body)}
//         c.ServeJSON()
//         return
//     }

//     // Respond with a success message
//     c.Data["json"] = map[string]string{"status": "success"}
//     c.ServeJSON()
// }


func (c *MainController) RemoveFromFavorite() {
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


// func (c *MainController) GetVotes() {
//     // Get API Key and Base URL from config
//     apiKey, _ := beego.AppConfig.String("cat_api_key")
//     baseURL, _ := beego.AppConfig.String("api_base_url")

//     // Build URL with query parameters
//     url := baseURL + "/votes"

//     // Get query parameters
//     queryParams := make([]string, 0)
    
//     // Handle optional parameters
//     if subID := c.GetString("sub_id"); subID != "" {
//         queryParams = append(queryParams, "sub_id="+subID)
//     }
//     if page := c.GetString("page"); page != "" {
//         queryParams = append(queryParams, "page="+page)
//     }
//     if limit := c.GetString("limit"); limit != "" {
//         queryParams = append(queryParams, "limit="+limit)
//     }
//     if order := c.GetString("order"); order != "" {
//         queryParams = append(queryParams, "order="+order)
//     }
//     if attachImage := c.GetString("attach_image"); attachImage != "" {
//         queryParams = append(queryParams, "attach_image="+attachImage)
//     }

//     // Add query parameters to URL if any exist
//     if len(queryParams) > 0 {
//         url += "?" + strings.Join(queryParams, "&")
//     }

//     // Create request
//     req, err := http.NewRequest("GET", url, nil)
//     if err != nil {
//         c.Data["json"] = map[string]interface{}{
//             "success": false,
//             "message": "Failed to create request",
//             "error":   err.Error(),
//         }
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.ServeJSON()
//         return
//     }

//     // Add headers
//     req.Header.Add("x-api-key", apiKey)
//     req.Header.Add("Content-Type", "application/json")

//     // Make request
//     client := &http.Client{}
//     resp, err := client.Do(req)
//     if err != nil {
//         c.Data["json"] = map[string]interface{}{
//             "success": false,
//             "message": "Failed to fetch votes",
//             "error":   err.Error(),
//         }
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.ServeJSON()
//         return
//     }
//     defer resp.Body.Close()

//     // Read response body
//     body, err := ioutil.ReadAll(resp.Body)
//     if err != nil {
//         c.Data["json"] = map[string]interface{}{
//             "success": false,
//             "message": "Failed to read response",
//             "error":   err.Error(),
//         }
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.ServeJSON()
//         return
//     }

//     // Check if the response status code is not successful
//     if resp.StatusCode != http.StatusOK {
//         c.Data["json"] = map[string]interface{}{
//             "success": false,
//             "message": "API request failed",
//             "error":   string(body),
//         }
//         c.Ctx.ResponseWriter.WriteHeader(resp.StatusCode)
//         c.ServeJSON()
//         return
//     }

//     // Parse response into votes array
//     var votes []map[string]interface{}
//     if err := json.Unmarshal(body, &votes); err != nil {
//         c.Data["json"] = map[string]interface{}{
//             "success": false,
//             "message": "Failed to parse response",
//             "error":   err.Error(),
//         }
//         c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
//         c.ServeJSON()
//         return
//     }

//     // Return success response
//     c.Data["json"] = map[string]interface{}{
//         "success": true,
//         "data":    votes,
//     }
//     c.ServeJSON()
// }


func (c *MainController) GetVotes() {
    votesChan := make(chan []map[string]interface{})
    errChan := make(chan error)

    go func() {
        apiKey, _ := beego.AppConfig.String("cat_api_key")
        baseURL, _ := beego.AppConfig.String("api_base_url")

        url := baseURL + "/votes"
        queryParams := make([]string, 0)
        
        if subID := c.GetString("sub_id"); subID != "" {
            queryParams = append(queryParams, "sub_id="+subID)
        }
        if page := c.GetString("page"); page != "" {
            queryParams = append(queryParams, "page="+page)
        }
        if limit := c.GetString("limit"); limit != "" {
            queryParams = append(queryParams, "limit="+limit)
        }
        if order := c.GetString("order"); order != "" {
            queryParams = append(queryParams, "order="+order)
        }
        if attachImage := c.GetString("attach_image"); attachImage != "" {
            queryParams = append(queryParams, "attach_image="+attachImage)
        }

        if len(queryParams) > 0 {
            url += "?" + strings.Join(queryParams, "&")
        }

        req, err := http.NewRequest("GET", url, nil)
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

        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            errChan <- err
            return
        }

        if resp.StatusCode != http.StatusOK {
            errChan <- fmt.Errorf("%s", string(body))
            return
        }

        var votes []map[string]interface{}
        if err := json.Unmarshal(body, &votes); err != nil {
            errChan <- err
            return
        }

        votesChan <- votes
    }()

    select {
    case votes := <-votesChan:
        c.Data["json"] = map[string]interface{}{
            "success": true,
            "data":    votes,
        }
        c.ServeJSON()
    case err := <-errChan:
        c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
        c.Data["json"] = map[string]interface{}{
            "success": false,
            "message": "Operation failed",
            "error":   err.Error(),
        }
        c.ServeJSON()
    }
}