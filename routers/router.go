// routers/router.go
package routers

import (
    "catapi-app/controllers"
    beego "github.com/beego/beego/v2/server/web"
)

func init() {
    beego.Router("/", &controllers.MainController{})
    beego.Router("/api/cat", &controllers.MainController{}, "get:GetRandomCat")
    beego.Router("/api/breeds", &controllers.MainController{}, "get:GetBreeds")
    beego.Router("/api/vote", &controllers.MainController{}, "post:Vote")
    // beego.Router("/api/favorites", &controllers.MainController{}, "post:AddToFavorite")
    beego.Router("/api/breeds/:breed_id/search", &controllers.MainController{}, "get:GetBreedImages")
    beego.Router("/api/breeds/:breed_id", &controllers.MainController{}, "get:GetBreedInfo")
    

}