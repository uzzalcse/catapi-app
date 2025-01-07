package tests

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	beego "github.com/beego/beego/v2/server/web"
	. "github.com/smartystreets/goconvey/convey"
)

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