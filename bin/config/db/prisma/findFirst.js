export default ({ libs }) => ({
    execute: async(name, data) => {
        return await libs('prisma')[name].findFirst(data)
    }
})