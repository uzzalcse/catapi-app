package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"runtime"
	"path/filepath"

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


