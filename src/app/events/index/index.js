export default ({ services, commands, libs }) => ({
    type: 'app::service',
    ops: {},
    handler: (data) => {
        console.log(data)
    }
})