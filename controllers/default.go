package controllers

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
    "catapi-app/models"
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
        
        url := fmt.Sprintf("%s/images/search?limit=1", baseURL)
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

func (c *MainController) Vote() {
    var vote models.Vote
    if err := json.Unmarshal(c.Ctx.Input.RequestBody, &vote); err != nil {
        c.Ctx.ResponseWriter.WriteHeader(http.StatusBadRequest)
        c.Data["json"] = map[string]string{"error": err.Error()}
        c.ServeJSON()
        return
    }
    
    errChan := make(chan error)
    
    go func() {
        apiKey, _ := beego.AppConfig.String("cat_api_key")
        baseURL, _ := beego.AppConfig.String("api_base_url")
        
        body, _ := json.Marshal(vote)
        req, err := http.NewRequest("POST", baseURL+"/votes", bytes.NewBuffer(body))
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
            errChan <- fmt.Errorf("failed to vote")
            return
        }
        
        errChan <- nil
    }()
    
    if err := <-errChan; err != nil {
        c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
        c.Data["json"] = map[string]string{"error": err.Error()}
    } else {
        c.Data["json"] = map[string]string{"status": "success"}
    }
    c.ServeJSON()
}

func (c *MainController) ToggleFavorite() {
    var fav models.Favorite
    if err := json.Unmarshal(c.Ctx.Input.RequestBody, &fav); err != nil {
        c.Ctx.ResponseWriter.WriteHeader(http.StatusBadRequest)
        c.Data["json"] = map[string]string{"error": err.Error()}
        c.ServeJSON()
        return
    }
    
    errChan := make(chan error)
    
    go func() {
        apiKey, _ := beego.AppConfig.String("cat_api_key")
        baseURL, _ := beego.AppConfig.String("api_base_url")
        
        body, _ := json.Marshal(map[string]string{"image_id": fav.ImageID})
        req, err := http.NewRequest("POST", baseURL+"/favourites", bytes.NewBuffer(body))
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
            errChan <- fmt.Errorf("failed to add favorite")
            return
        }
        
        errChan <- nil
    }()
    
    if err := <-errChan; err != nil {
        c.Ctx.ResponseWriter.WriteHeader(http.StatusInternalServerError)
        c.Data["json"] = map[string]string{"error": err.Error()}
    } else {
        c.Data["json"] = map[string]string{"status": "success"}
    }
    c.ServeJSON()
}