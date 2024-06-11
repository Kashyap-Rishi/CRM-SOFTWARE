   const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ error: message });
  };
  
   const sendSuccessResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ message });
  };

  module.exports={sendSuccessResponse,sendErrorResponse};