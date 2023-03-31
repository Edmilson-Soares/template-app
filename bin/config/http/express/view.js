export default ({ route, auth, forawait }) => ({
    path: route.prefix + route.path,
    auth: async(req, res, next) => {
        try {

            const {
                user,
                error
            } = await auth({
                jwt: req.cookies[process.env.COOKIE_NAME + '_jwt'],
                role: req.user || 'auth',
            })


            if (error) {
                req.query['redirect'] = error.redirect
            }



            req.body = {
                user: user
            }

            req.user = user



        } catch (error) {
            console.log(error, 'dd-')
            res.redirect(route.login)
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
                        res.cookie(process.env.COOKIE_NAME + '_' + name, cookie)
                    }
                    if (clearcookie) {
                        res.cookie(process.env.COOKIE_NAME + '_' + name, '')
                    }
                    if (redirect) {
                        res.redirect(redirect)
                    } else {
                        if (req.body)
                            req.body[name] = data
                    }



                } catch (error) {
                    console.log(error, 'fff')
                    res.redirect(route.login)
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
                    // req[name] = validacao.parse(req[name])
                } catch (error) {
                    console.log(error, 'fff')
                        // res.redirect(route.login)
                        //   next()
                }


            }

        }, {})
        next()

    },
    fn: async(req, res) => {

        const { status, cookie, data } = await route.handler({
            cookies: req.cookies,
            body: req.body,
            headers: req.headers,
            query: req.query,
            params: req.params
        })

        if (req.query.redirect) {

            return res.redirect(req.query.redirect)

        }


        if (cookie) {
            res.cookie(process.env.COOKIE_NAME + '_' + cookie.name, cookie.data, { httpOnly: true })
        }



        if (route.res[status].parse) {
            try {
                const resp = route.res[status].parse(data)
                res.render(route.render, { page: {...resp, user: req.body.user } })
            } catch (error) {


                res.redirect(route.error)

            }

        } else {

            try {
                res.render(route.render, { page: {...data, user: req.body.user } })
            } catch (error) {


                res.redirect(route.error)

            }


            // res.redirect(route.error)
        }



    }
})