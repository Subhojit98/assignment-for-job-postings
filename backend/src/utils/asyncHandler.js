const asyncHandler = (fn) => {

    return async (req, res, next) => {
        try {

            return await fn(req, res, next)
        } catch (error) {
            console.log(error)
        }
    }
}

export default asyncHandler