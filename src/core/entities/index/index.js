export default ({ z }) => ({
    entity: (data) => {
        const entity = z.object({
            email: z.string().email(),
            name: z.string()
        })
        return entity.parse(data)

    }
})