import api from "./api.js"
import view from "./view.js"

export default async({ routers, auth: auth_, app, forawait }) => {

    const context = {
        api,
        view
    }

    await forawait.generate(routers, async(route) => {
        const { path, middlewares, auth, fn, req } = await context[route.context]({ route, auth: auth_(route.auth), forawait })

        //.toUpperCase()

        app.route({
            method: route.type.toUpperCase(),
            url: path,

            // this function is executed for every request before the handler is executed
            preHandler: async(request, reply) => {
                // E.g. check authentication
            },
            handler: async(request, reply) => {
                // server.io.emit('hello')
                //return { hello: 'world' }


                reply.send({})
            }
        })

        // router[route.type.toLowerCase()](path, req, middlewares, auth, fn)
    }, {})



}