export default async({ file, path, forawait, rx, entities, dbs, libs, services, fileCommand }) => {
    if (file.includes('.js')) {
        const file_ = `./../../${fileCommand}/${path}/${file}`
        try {
            const command = await
            import (file_)
            return {
                name: 'app::' + path + '.' + file.split('.js')[0],
                fn: command.default({ services, forawait, entities, dbs, libs, rx })
            }
        } catch (error) {
            console.log(error)
        }

    }



}