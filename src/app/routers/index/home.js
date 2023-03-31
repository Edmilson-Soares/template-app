export default ({ z }) => ({
    route: {
        path: '',
        prefix: '',
        context: 'view',
        render: 'index',
        login: '/auth/login',
        error: '/errors',
        type: 'GET',
        handler: 'index.index',
        req: {
            query: {},
            body: {

            },
            params: {

            },
            headers: {

            },
            cookie: {

            }

        },
        res: {
            200: {},
            400: {

            },
            403: {

            },
            500: {

            }

        },
        auth: [],
        middlewares: ['index.index']
    }
})