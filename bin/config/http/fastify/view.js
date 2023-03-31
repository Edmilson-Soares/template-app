export default (route) => ({
    path: '/' + route.prefix + route.path,
    auth: async(req, res, next) => {

        next()
    },
    middlewares: async(req, res, next) => {
        next()

    },
    req: async(req, res, next) => {
        next()

    },
    res: async(req, res, next) => {
        next()

    },
    fn: async(req, res) => {

        return res.json({

        })
    }
})