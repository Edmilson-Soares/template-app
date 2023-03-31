export default async({ file, path, events, libs, services, forawait, fileJob }) => {
    if (file.includes('.js')) {
        const file_ = `./../../${fileJob}/${path}/${file}`
        try {
            const job = await
            import (file_)
            return {
                name: 'infra::' + path + '.' + file.split('.js')[0],
                job: job.default({ libs, events, forawait, services })
            }
        } catch (error) {
            console.log(error)
        }

    }



}