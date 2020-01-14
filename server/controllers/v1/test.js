const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const Test = require('../../models/v1/Test');

exports.getTestPage = asyncHandler(async (req, res, next) => {
  const tests = await Test.find();
  if (tests.length === 0) {
    return next(new ErrorResponse('데이터가 존재하지 않습니다. ', 404));
  }
  res.status(200).json({ success: true, results: tests });
});
