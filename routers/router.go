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
    beego.Router("/api/votes", &controllers.MainController{}, "get:GetVotes") // Fetch votes
    beego.Router("/api/breeds/:breed_id/search", &controllers.MainController{}, "get:GetBreedImages")
    beego.Router("/api/breeds/:breed_id", &controllers.MainController{}, "get:GetBreedInfo")
    beego.Router("/favorites", &controllers.MainController{}, "get:GetFavorites")        // Fetch all favorites
    beego.Router("/favorites", &controllers.MainController{}, "post:AddToFavorite")     // Add a favorite
    beego.Router("/favorites/:favorite_id", &controllers.MainController{}, "delete:RemoveFromFavorite") // Remove a favorite
        


}