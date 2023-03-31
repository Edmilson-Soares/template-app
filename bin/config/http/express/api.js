export default ({ route, auth, forawait }) => ({
    path: '/api/' + route.prefix + route.path,
    auth: async(req, res, next) => {
        try {

            if (req.query.redirect) return next()
            let jwt;
            if (req.headers.authorization) {
                jwt = req.headers.authorization.split(' ')[1]
            }
            const {
                user,
                error
            } = await auth({
                jwt: jwt || req.cookies[process.env.COOKIE_NAME + '_jwt'] || req.query.jwt,
                role: req.user || 'auth',
            })
            if (error) {
                res.status(403)
                next(error)
            }


            req.body.user = user


            req.user = user

            await next()



        } catch (error) {
            // console.log(error)
            res.status(403)
            next(error.message)
        }





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

                        res.cookie(process.env.COOKIE_NAME + '_' + name, cookie, { httpOnly: true })
                            // res.cookie(name, cookie)
                    }
                    if (clearcookie) {
                        res.cookie(process.env.COOKIE_NAME + '_' + ame, '')
                    }
                    if (redirect) {
                        console.log('ddd')

                        req.query['redirect'] = redirect
                            // res.redirect(redirect)
                    } else {
                        if (req.body)
                            req.body[name] = data
                    }

                } catch (error) {
                    next(error.message)
                }


            }

        }, {})

        next()

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

            }

        }, {})
        next()

    },
    fn: async(req, res) => {

        if (req.query.redirect) {

            return res.redirect(req.query.redirect)

        }

        if (req.query.jwt) {
            res.cookie(process.env.COOKIE_NAME + '_jwt', req.query.jwt, { httpOnly: true })

            return res.redirect(route.redirect || req.query.redirect)

        }
        const { status, data } = await route.handler({
            cookies: req.cookies,
            body: req.body,
            headers: req.headers,
            query: req.query,
            params: req.params
        })
        if (route.res[status].parse) {
            try {
                const resp = route.res[status].parse(data)
                return res.json(resp)
            } catch (error) {
                return res.status(500).send(error.message)
            }

        } else
            return res.status(status || 200).send(data)



    }
})