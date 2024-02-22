const asyncHandeler = (handelterFunc) => {
    return (req, res, next) => {
        Promise.resolve(handelterFunc(req, res, next)).catch(err => next(err))
    }
}


// const asyncHandeler = (handelterFunc) => async (req, res, next) => {
//     try {
//         await handelterFunc(req, res, next)
//     } catch (error) {
//         res.status(500).json({ success: false, message: error })
//     }
// }


export default asyncHandeler