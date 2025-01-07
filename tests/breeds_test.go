package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"

	beego "github.com/beego/beego/v2/server/web"
	. "github.com/smartystreets/goconvey/convey"
)

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