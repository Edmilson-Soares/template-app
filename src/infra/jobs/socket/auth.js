export default ({ libs, events, services, forawait }) => ({
    path: '/auth',
    auth: async(socket, next) => {
        next()
    },
    connection: (events) => async(socket) => {
        console.log(socket)

        await forawait.generate(events, async(event) => {
            //console.log(event)
            socket.on(event.ops.name, event.handler);
        }, {})

        socket.on('disconnect', (socket) => {
            console.log('user disconnected');
        });
    }
})