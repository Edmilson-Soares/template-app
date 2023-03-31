export default () => {
    return (list) => ({
        auth: (role) => {

            return list.find(e => e == role)
        }
    })
}