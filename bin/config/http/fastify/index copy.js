import express from "express"
const app = express()
import route from './route.js'
import auth from "./auth.js"
export default async({ routers, fn, services, forawait }) => {
    const router = await route({ routers, auth: auth({ fn: fn(), services }), forawait })
    return {
        io: {},
        start: async() => {
            app.use(router)
            app.listen(process.env.HTTP_SERVER_PORT || 3000, () => {
                console.log(`Example app listening on port ${process.env.HTTP_SERVER_PORT || 3000}`)
            })
        },
        close: () => {
            app.close()
        }
    }
}