//https://crontab.guru/

export default ({ services, libs }) => ({
    type: 'app::cron',
    ops: {
        time: '* * * * * *',
        state: false
    },
    handler: async() => {
        console.log('data')
    }
})