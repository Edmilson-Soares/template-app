export default ({ services, forawait, entities, dbs, libs, rx }) => ({
    handler: async(data) => {
        try {

            await services.service('app::index.index').execute({ m: 'dddd' })

        } catch (error) {

        }

    }
})