package tests

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	beego "github.com/beego/beego/v2/server/web"
	. "github.com/smartystreets/goconvey/convey"
)

func TestGetVotes(t *testing.T) {
	r, _ := http.NewRequest("GET", "/api/votes", nil)
	w := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)

	Convey("Test GetVotes endpoint", t, func() {
		Convey("Status Code Should Be 200", func() {
			So(w.Code, ShouldEqual, 200)
		})
		Convey("Response should be JSON", func() {
			So(w.Header().Get("Content-Type"), ShouldContainSubstring, "application/json")
		})
		Convey("Response body should not be empty", func() {
			So(w.Body.Len(), ShouldBeGreaterThan, 0)
		})
	})
}

func TestVote(t *testing.T) {
	jsonStr := []byte(`{"image_id": "test123", "value": 1}`)
	r, _ := http.NewRequest("POST", "/api/vote", bytes.NewBuffer(jsonStr))
	r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)

	Convey("Test Vote endpoint", t, func() {
		Convey("Response should be JSON", func() {
			So(w.Header().Get("Content-Type"), ShouldContainSubstring, "application/json")
		})
		Convey("Response body should not be empty", func() {
			So(w.Body.Len(), ShouldBeGreaterThan, 0)
		})
	})

	// Test invalid vote value
	jsonStr = []byte(`{"image_id": "test123", "value": 2}`)
	r, _ = http.NewRequest("POST", "/api/vote", bytes.NewBuffer(jsonStr))
	r.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)

	Convey("Test Vote endpoint with invalid value", t, func() {
		Convey("Should return 400 Bad Request", func() {
			So(w.Code, ShouldEqual, 400)
		})
	})
}

func TestVoteEndpointValidation(t *testing.T) {
	testCases := []struct {
		name       string
		payload    string
		expectCode int
	}{
		{
			name:       "Empty payload",
			payload:    `{}`,
			expectCode: 400,
		},
		{
			name:       "Missing value",
			payload:    `{"image_id": "test123"}`,
			expectCode: 400,
		},
		{
			name:       "Missing image_id",
			payload:    `{"value": 1}`,
			expectCode: 400,
		},
		{
			name:       "Invalid value type",
			payload:    `{"image_id": "test123", "value": "invalid"}`,
			expectCode: 400,
		},
	}

	for _, tc := range testCases {
		Convey(tc.name, t, func() {
			r, _ := http.NewRequest("POST", "/api/vote", bytes.NewBufferString(tc.payload))
			r.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			beego.BeeApp.Handlers.ServeHTTP(w, r)

			Convey("Should return expected status code", func() {
				So(w.Code, ShouldEqual, tc.expectCode)
			})
			Convey("Response should be JSON", func() {
				So(w.Header().Get("Content-Type"), ShouldContainSubstring, "application/json")
			})
		})
	}
}

func TestGetVotesWithParams(t *testing.T) {
	testCases := []struct {
		name   string
		url    string
		params string
	}{
		{
			name:   "With sub_id",
			url:    "/api/votes",
			params: "?sub_id=test-user",
		},
		{
			name:   "With page and limit",
			url:    "/api/votes",
			params: "?page=1&limit=10",
		},
		{
			name:   "With order",
			url:    "/api/votes",
			params: "?order=DESC",
		},
	}

	for _, tc := range testCases {
		Convey(tc.name, t, func() {
			r, _ := http.NewRequest("GET", tc.url+tc.params, nil)
			w := httptest.NewRecorder()
			beego.BeeApp.Handlers.ServeHTTP(w, r)

			Convey("Status Code Should Be 200", func() {
				So(w.Code, ShouldEqual, 200)
			})
			Convey("Response should be JSON", func() {
				So(w.Header().Get("Content-Type"), ShouldContainSubstring, "application/json")
			})
		})
	}
}