export default (system) => ({
    execute: ({ cookies, body, query, params }) => {

        try {
            return {
                name: 'user',
                cookie: '',
                redirect: '',
                clearcookie: '',
                data: {}
            }
        } catch (error) {
            return {
                name: 'user',
                cookie: '',
                clearcookie: '',
                redirect: '',
                data: {}
            }
        }
    }
})