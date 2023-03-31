export default {
    generator: function* generator(array) {
        for (let index = 0; index < array.length; index++) {
            yield array[index];

        }
    },
    generator_fn: function* generator(data) {
        if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
                yield { data: data[index], index };

            }
        } else {
            data = Object.entries(data)

            for (let index = 0; index < data.length; index++) {
                yield { data: data[index][1], name: data[index][0] };

            }
        }

    },

    generate: async function(data, fn, ops, fun_error) {
        let flag = false;
        const fn_g = this.generator_fn(data)
        while (!flag) {
            const { value, done } = fn_g.next()
            if (value) {

                try {
                    await fn(value.data, {...ops, index: value.index, name: value.name })
                } catch (error) {
                    try {
                        await fun_error(error)
                    } catch (error) {

                    }

                }

            }
            flag = done
        }
    }

}