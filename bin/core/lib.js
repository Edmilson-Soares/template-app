export default async({ file, system = {}, fileLib }) => {

    if (file.includes('.js')) {
        const file_ = `./../../${fileLib}/${file}`
        try {
            const lib = await
            import (file_)
            return {
                name: file.split('.js')[0],
                obs: lib.default(system)
            }

        } catch (error) {
            console.log(error)
        }

    }



}