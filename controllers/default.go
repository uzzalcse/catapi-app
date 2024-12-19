// controllers/default.go
package controllers

import (
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

func (c *MainController) GetRandomCats() {
    limit := c.GetString("limit", "9")
    breedId := c.GetString("breed_id", "")
    
    catChan := make(chan []models.Cat)
    errChan := make(chan error)
    
    go func() {
        apiKey, _ := beego.AppConfig.String("cat_api_key")
        baseURL, _ := beego.AppConfig.String("api_base_url")
        
        url := fmt.Sprintf("%s/images/search?limit=%s", baseURL, limit)
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
        
        catChan <- cats
    }()
    
    select {
    case cats := <-catChan:
        c.Data["json"] = cats
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