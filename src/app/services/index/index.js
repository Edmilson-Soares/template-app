export default ({ commands, forawait, libs, services, rx, dbs, entities }) => ({
    execute: (data) => {

        rx.next(data)
        return data
    }
})