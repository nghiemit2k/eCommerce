const asyncHandler = fn => {
    return (req, res,next) => {
        console.log(req.body)
        fn(req, res, next).catch(next);
    }
}

module.exports = asyncHandler;