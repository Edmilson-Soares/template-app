export default (services) => ({
    handler: async({ body, query, params, headers }) => {
        try {
            return {
                status: 200,
                data: services.service('app::index.index').execute({ m: 'dddd' })
            }
        } catch (error) {
            return {
                status: 500,
                data: { n: 'dd' }
            }
        }

    }
})