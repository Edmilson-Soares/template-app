import express from "express"
import api from "./api.js"
import view from "./view.js"


export default async({ routers, io, auth: auth_, forawait }) => {

    const router = express.Router()

    const context = {
        api,
        view
    }

    await forawait.generate(routers, async(route) => {
        const { path, middlewares, auth, fn, req } = await context[route.context]({ route, io, auth: auth_(route.auth), forawait })
        router[route.type.toLowerCase()](path, req, middlewares, auth, fn)
    }, {}, console.log)

    return router

}