export default async({ file, path, z, controllers, middlewares, auth, fileRouter }) => {

    if (file.includes('.js')) {
        const file_ = `./../../${fileRouter}/${path}/${file}`
        try {
            const router = await
            import (file_)
            const { route } = router.default({ file: file.split('.js')[1], z, path })
            route.handler = controllers.controller('app::' + route.handler).handler
            route.middlewares = middlewares(route.middlewares)
            return {
                route
            }
        } catch (error) {
            console.log(error)
        }

    }



}