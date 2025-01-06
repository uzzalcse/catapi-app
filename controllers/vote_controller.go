package controllers

import (
	"bytes"
	"catapi-app/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	beego "github.com/beego/beego/v2/server/web"
)

// VoteController handles voting-related operations.
type VoteController struct {
	beego.Controller
}

// Vote allows a user to vote on an image.
func (c *VoteController) Vote() {
	var vote models.Vote

	// Parse request body into the vote struct.
	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &vote); err != nil {
		c.Ctx.ResponseWriter.WriteHeader(http.StatusBadRequest)
		c.Data["json"] = map[string]string{"error": err.Error()}
		c.ServeJSON()
		return
	}

	// Validate input data.
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
			errChan <- fmt.Errorf("missing base URL")
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

		if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
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

// GetVotes retrieves a list of votes based on query parameters.
func (c *VoteController) GetVotes() {
	votesChan := make(chan []map[string]interface{})
	errChan := make(chan error)

	go func() {
		apiKey, _ := beego.AppConfig.String("cat_api_key")
		baseURL, _ := beego.AppConfig.String("api_base_url")

		url := baseURL + "/votes"
		queryParams := []string{}

		// Collect query parameters from the request.
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

		// Construct the URL with query parameters.
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
