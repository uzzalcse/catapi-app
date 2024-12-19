package main

import (
    "github.com/beego/beego/v2/server/web"
    _ "catapi-app/routers"
)

func main() {
    web.Run()
}