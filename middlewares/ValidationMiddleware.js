const { responseError } = require("../utils/responseHandlers")

exports.validateField = (joiSchema, validateOn = 'body') => (req, res, next) => {
    const validate = joiSchema.validate(req[validateOn])
    if (validate.error) {
        responseError(res, validate.error.details[0].message,400)
        return
    }
    next()
}