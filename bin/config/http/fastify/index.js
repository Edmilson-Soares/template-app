import fastify from 'fastify'
import route from './route.js'
import auth from "./auth.js"

const app = fastify({ logger: false })




export default async({ routers, fn, services, forawait }) => {
    await route({ routers, auth: auth({ fn: fn(), services }), app, forawait })
    return {
        io: {},
        start: async() => {
            //app.use(router)



            try {

                await app.listen({ port: process.env.HTTP_SERVER_PORT })
                console.log(`Example app listening on port ${process.env.HTTP_SERVER_PORT || 3000}`)

            } catch (err) {
                server.log.error(err)
                process.exit(1)
            }



        },
        close: () => {
            app.close()
        }
    }
}