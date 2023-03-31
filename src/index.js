export default {
    register: async(system) => {

        // console.log(system, 'j')

    },
    bootstrap: async(system) => {
        // console.log(system, 'ddd')

        //desc


        //console.log(system.plugins('libs').lib('crypto_micro').encrText(process.env.PUBLIC_KEY))


        console.log(system.plugins('libs').lib('crypto_micro').descText(process.env.PRIVATE_KEY))

        console.log(system.plugins('libs').lib('crypto_micro').descText(process.env.PUBLIC_KEY))
            //  descText

    },
    distroy: async(system) => {
        console.log('close')



    }
}