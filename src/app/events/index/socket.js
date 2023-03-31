export default ({ services, libs }) => ({
    type: 'app::socket',
    ops: {
        path: 'app'
    },
    handler: (data) => {
        console.log(data)
    }
})