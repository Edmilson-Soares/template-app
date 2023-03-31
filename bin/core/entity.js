export default async({ path, file, libs, fileEntity }) => {

    if (file.includes('.js')) {
        const file_ = `./../../${fileEntity}/${path}/${file}`
        try {
            const entity = await
            import (file_)
            return {
                name: 'core::' + path + '.' + file.split('.js')[0],
                fn: entity.default({...libs })
            }
        } catch (error) {
            console.log(error)
        }

    }



}