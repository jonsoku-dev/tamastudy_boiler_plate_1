const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  console.log(err.stack.red);

  // [Mongoose] 해당하는 ObjectId가 없을 때
  // CastError (Mongoose bad ObjectId)
  if (err.name === 'CastError') {
    const message = `${error.value}에 해당하는 리소스를 찾을 수 없습니다.`;
    error = new ErrorResponse(message, 404);
  }

  // [Mongoose] 값이 중복되었을 때 (unique)
  // Duplicate key
  if (err.code === 11000) {
    const message = '값이 중복되었습니다. ';
    error = new ErrorResponse(message, 400);
  }

  // [Mongoose] Validation 에러
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    errors: error.message || '서버 에러입니다.'
  });
};

module.exports = errorHandler;
