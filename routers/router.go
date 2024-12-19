// routers/router.go
package routers

import (
    "catapi-app/controllers"
    beego "github.com/beego/beego/v2/server/web"
)

func init() {
    beego.Router("/", &controllers.MainController{})
    beego.Router("/api/cats", &controllers.MainController{}, "get:GetRandomCats")
    beego.Router("/api/breeds", &controllers.MainController{}, "get:GetBreeds")
}