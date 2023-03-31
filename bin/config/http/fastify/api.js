export default ({ route, auth, forawait }) => ({
    path: '/api/' + route.prefix + route.path,
    auth: async(req, res, next) => {
        try {

            const {
                user,
                error
            } = await auth({
                role: req.user || 'auth',
            })
            if (error) {
                res.status(403)
                next(error)
            }

        } catch (error) {
            console.log(error)
            res.status(403)
            next(error.message)
        }




        await next()
    },
    middlewares: async(req, res, next) => {
        await forawait.generate(route.middlewares, async(middleware) => {

            if (middleware) {
                try {
                    const {
                        name,
                        data,
                        cookie,
                        clearcookie,
                        redirect
                    } = await middleware({
                        cookies: req.cookies,
                        body: req.body,
                        headers: req.headers,
                        query: req.query,
                        params: req.params
                    })



                    if (cookie) {
                        res.cookie(name, cookie)
                    } else if (clearcookie) {
                        res.cookie(name, '')
                    } else if (redirect) {
                        res.redirect(redirect)
                    } else {
                        if (req.body)
                            req.body[name] = data
                    }

                } catch (error) {
                    next(error.message)
                }
                next()

            }

        }, {})

    },
    req: async(req, res, next) => {
        await forawait.generate(Object.entries(route.req), async(obs) => {
            const [name, validacao] = obs
            if (validacao.parse) {
                try {
                    req[name] = validacao.parse(req[name])
                } catch (error) {
                    next(error.message)
                }
                next()

            }

        }, {})
        next()

    },
    fn: async(request, reply) => {

        const { status, data } = await route.handler(req.body)
        if (route.res[status].parse) {
            try {
                const resp = route.res[status].parse(data)
                return res.status(status || 200).send(resp)
            } catch (error) {
                return res.status(500).send(error.message)
            }

        } else
            return res.status(status || 200).send(data)
    }
})