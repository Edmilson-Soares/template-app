export default ({ fn, services }) =>

(roles) =>
async({ role }) => {

    if (fn(roles).auth(role)) {

        return {
            user: {}
        }
    } else {
        return {
            error: 'Não autorizado'
        }
    }



}