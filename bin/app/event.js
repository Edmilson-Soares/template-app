export default async({ file, path, libs, services, commands, fileEvent }) => {

    if (file.includes('.js')) {
        const file_ = `./../../${fileEvent}/${path}/${file}`
        try {
            const event = await
            import (file_)
            return {
                name: 'app::' + path + '.' + file.split('.js')[0],
                event: event.default({ libs, services, commands })
            }
        } catch (error) {
            console.log(error)
        }

    }



}