package routers

import (
    "catapi-app/controllers"
    beego "github.com/beego/beego/v2/server/web"
)

func init() {
    beego.Router("/", &controllers.MainController{})
    beego.Router("/api/cat", &controllers.CatController{}, "get:GetRandomCat")
    beego.Router("/api/breeds", &controllers.CatController{}, "get:GetBreeds")
    beego.Router("/api/vote", &controllers.VoteController{}, "post:Vote")
    beego.Router("/api/votes", &controllers.VoteController{}, "get:GetVotes") // Fetch votes
    beego.Router("/api/breeds/:breed_id/search", &controllers.CatController{}, "get:GetBreedImages")
    beego.Router("/api/breeds/:breed_id", &controllers.CatController{}, "get:GetBreedInfo")
    beego.Router("/api/favorites", &controllers.FavoriteController{}, "get:GetFavorites")        // Fetch all favorites
    beego.Router("/api/favorites", &controllers.FavoriteController{}, "post:AddToFavorite")     // Add a favorite
    beego.Router("/api/favorites/:favorite_id", &controllers.FavoriteController{}, "delete:RemoveFromFavorite") // Remove a favorite        
}