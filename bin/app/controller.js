export default async({ file, path, services = {}, fileController }) => {

    if (file.includes('.js')) {
        const file_ = `./../../${fileController}/${path}/${file}`
        try {
            const controller = await
            import (file_)
            return {
                name: 'app::' + path + '.' + file.split('.js')[0],
                fn: controller.default(services)
            }
        } catch (error) {
            console.log(error)
        }

    }



}