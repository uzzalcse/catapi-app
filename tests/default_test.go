package tests

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/beego/beego/v2/core/logs"

	_ "catapi-app/routers"

	beego "github.com/beego/beego/v2/server/web"
	. "github.com/smartystreets/goconvey/convey"
)

func init() {
	_, file, _, _ := runtime.Caller(0)
	apppath, _ := filepath.Abs(filepath.Dir(filepath.Join(file, ".." + string(filepath.Separator))))
	beego.TestBeegoInit(apppath)
}


// TestBeego is a sample to run an endpoint test
func TestBeego(t *testing.T) {
	r, _ := http.NewRequest("GET", "/", nil)
	w := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)

	logs.Trace("testing", "TestBeego", "Code[%d]\n%s", w.Code, w.Body.String())

	Convey("Subject: Test Station Endpoint\n", t, func() {
	        Convey("Status Code Should Be 200", func() {
	                So(w.Code, ShouldEqual, 200)
	        })
	        Convey("The Result Should Not Be Empty", func() {
	                So(w.Body.Len(), ShouldBeGreaterThan, 0)
	        })
	})
}
func TestGetRandomCat(t *testing.T) {
	r, _ := http.NewRequest("GET", "/api/cat", nil)
	w := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)

	Convey("Test GetRandomCat endpoint", t, func() {
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

func TestGetBreeds(t *testing.T) {
	r, _ := http.NewRequest("GET", "/api/breeds", nil)
	w := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)

	Convey("Test GetBreeds endpoint", t, func() {
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

func TestGetBreedInfo(t *testing.T) {
	r, _ := http.NewRequest("GET", "/api/breeds/abys", nil)
	w := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)

	Convey("Test GetBreedInfo endpoint", t, func() {
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

func TestGetFavorites(t *testing.T) {
	r, _ := http.NewRequest("GET", "/api/favorites", nil)
	w := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)

	Convey("Test GetFavorites endpoint", t, func() {
		Convey("Status Code Should Be 200", func() {
			So(w.Code, ShouldEqual, 200)
		})
		Convey("Response should be JSON", func() {
			So(w.Header().Get("Content-Type"), ShouldContainSubstring, "application/json")
		})
	})
}


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


func TestAddToFavorite(t *testing.T) {
	jsonStr := []byte(`{"image_id": "test123"}`)
	r, _ := http.NewRequest("POST", "/api/favorites", bytes.NewBuffer(jsonStr))
	w := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)

	Convey("Test AddToFavorite endpoint", t, func() {
		Convey("Response should be JSON", func() {
			So(w.Header().Get("Content-Type"), ShouldContainSubstring, "application/json")
		})
		Convey("Response body should not be empty", func() {
			So(w.Body.Len(), ShouldBeGreaterThan, 0)
		})
	})
}

func TestRemoveFromFavorite(t *testing.T) {
	r, _ := http.NewRequest("DELETE", "/api/favorites/123", nil)
	w := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)

	Convey("Test RemoveFromFavorite endpoint", t, func() {
		Convey("Response should be JSON", func() {
			So(w.Header().Get("Content-Type"), ShouldContainSubstring, "application/json")
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

func TestGetBreedImages(t *testing.T) {
	r, _ := http.NewRequest("GET", "/api/breeds/abys/search", nil)
	w := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)

	Convey("Test GetBreedImages endpoint", t, func() {
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

	// Test with invalid breed ID
	r, _ = http.NewRequest("GET", "/api/breeds/invalid-breed/search", nil)
	w = httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(w, r)

	Convey("Test GetBreedImages endpoint with invalid breed", t, func() {
		Convey("Response should be JSON", func() {
			So(w.Header().Get("Content-Type"), ShouldContainSubstring, "application/json")
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
