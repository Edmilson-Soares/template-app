import system from './system.js'
//console.log(process.env)
try {
    await system.start({
        db_name: 'prisma'
    })

    process.on('uncaughtException', (error, origin) => {
            console.log(`\n${origin} signal received. \n${error}`)
        })
        // se nao tiver ele, o sistema joga um warn
    process.on('unhandledRejection', (error) => {
            console.log(`\nunhandledRejection signal received. \n${error}`)
        })
        // ---- grafulshutdown

    function grafulShutdown(event) {
        return async(code) => {
            await system.close()
            console.log(`${event} received! with ${code}`)
        }
    }

    // Disparado no Ctrl + C no terminal -> multi plataforma
    process.on('SIGINT', grafulShutdown('SIGINT'))

    // Disparado no kill
    process.on('SIGTERM', grafulShutdown('SIGTERM'))

    process.on('exit', (code) => {
        console.log('exit signal received', code)
    })

} catch (error) {
    await system.error(error)
}