export default async({ file, path, forawait, libs, commands, db, dbs, entities, rx, services, fileService }) => {

    if (file.includes('.js')) {
        const file_ = `./../../${fileService}/${path}/${file}`
        try {
            const service = await
            import (file_)
            return {
                name: 'app::' + path + '.' + file.split('.js')[0],
                fn: service.default({ commands, forawait, libs, db, services, rx, dbs, entities })
            }
        } catch (error) {
            console.log(error)
        }

    }



}