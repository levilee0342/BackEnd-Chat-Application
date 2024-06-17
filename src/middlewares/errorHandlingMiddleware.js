const invalidPathHandler = (req, res, next) => {
  const error = new Error("Invalid path");
  error.statusCode = 404;
  next(error);
  // next(error) đẻ chuyển tiếp middelware có tham số error (errorResponseHandler)
};

// khi nào bị lỗi trong chương trình nó sẻ tự vào đây
const errorResponseHandler = (err, req, res, next) => {
  console.log("development" ? err.stack : null);
  const statusCode = err.statusCode || 401;
  return res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
export { invalidPathHandler, errorResponseHandler };
