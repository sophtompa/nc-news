const handlePsqlError = (err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg: 'bad request'})
    }
    else {
    next(err); }
};

const handleCustomError = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status).send({msg: err.msg})
    }
    else {
    next(err); }
}



const handleServerError = (err, req, res, next) => {
    res.status(500).send({msg: 'internal server error'})
}

module.exports = { handlePsqlError, handleCustomError, handleServerError }