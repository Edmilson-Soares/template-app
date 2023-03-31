export default async({
    path,
    forawait,
    auth,
    sockets,
    events,
    services,
    z,
    routers = [],
    fileHttp
}) => {

    const file_ = `./../../${fileHttp}/${path}/index.js`
    try {
        const http = await
        import (file_)
        const server = await http.default({
            routers,
            fn: auth,
            sockets,
            events,
            services,
            z,
            forawait
        })
        return {
            name: path,
            server: {
                io: server.io,
                start: (ops) => {
                    server.start(ops)
                },
                close: () => {
                    server.close()
                },
            }


        }
    } catch (error) {
        console.log(error)
    }





}