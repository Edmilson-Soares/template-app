export default ({ fn, services }) =>

(roles) =>
async({ role, jwt }) => {

    console.log(jwt, roles)

    try {
        const user = await services.service('app::user.jwt').execute({ jwt })



        if (!user.id && roles.length > 0) return {
            error: {
                redirect: '/auth/login'
            }
        }

        if (!user.id) return { jwt }

        if (roles.length == 0) {
            user.jwt = jwt
            return {
                user: user || { jwt }
            }
        }

        if (fn(roles).auth(user.role)) {
            user.jwt = jwt
            return {
                user: user || { jwt }
            }
        } else {
            return {
                error: {
                    redirect: '/auth/login'
                }

            }
        }



    } catch (error) {


        if (roles.length) return {
            error: {
                redirect: '/auth/login'
            }
        }

        return {
            user: {}
        }
    }




}