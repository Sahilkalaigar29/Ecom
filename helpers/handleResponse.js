const sendResponse = (res, statusCode, status, message = '', data) => {
    try {
        let response = {
            status: status,
            message: message,
            data: data
        };
        res.status(statusCode).json(response);
    } catch (error) {
        return error;
    }
    
}

module.exports = { sendResponse };