export default ({ z }) => ({
    route: {
        path: 'ddd',
        prefix: '',
        context: 'api',
        type: 'GET',
        handler: 'index.index',
        req: {
            query: z.object({
                jwt: z.string(),
            }),
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
            200: z.object({
                m: z.string(),
            }),
            400: {

            },
            403: {

            },
            500: {

            }

        },
        auth: ['auth'],
        middlewares: ['index.index']
    }
})