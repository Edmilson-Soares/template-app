export default async({ file, path, libs, fileDb }) => {
    if (file.includes('.js')) {
        const file_ = `./../../${fileDb}/${path}/${file}`
        try {
            const db = await
            import (file_)
            return {
                name: 'infra::' + path + '.' + file.split('.js')[0],
                db: db.default({ libs })
            }
        } catch (error) {
            console.log(error)
        }

    }



}