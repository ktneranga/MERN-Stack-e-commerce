//handle not found errors (2)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

//handle other errors (1)
const errorHandler = (err, req, res, next) => {
    /* when we have an error it responds a status code 
        but some times there might be an error with 200 status code - we have to handle that
    */
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    res.json({
        /*we use async handler for error handling. so if there are any error 
        in the catch part this gives us that message*/
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

export { notFound, errorHandler }