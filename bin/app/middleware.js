export default async({ file, path, z, services = {}, fileMiddleware }) => {

    if (file.includes('.js')) {
        const file_ = `./../../${fileMiddleware}/${path}/${file}`
        try {
            const middleware = await
            import (file_)
            return {
                name: 'app::' + path + '.' + file.split('.js')[0],
                fn: middleware.default({ services, z })
            }
        } catch (error) {
            console.log(error)
        }

    }



}