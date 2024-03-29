const {
  FILE_TOO_BIG,
  DATA_NOT_FOUND,
  DATA_EXIST,
  KADIN_ONLY,
} = require("../constants/ErrorKeys");
const { loggerError } = require("../helpers/loggerDebug");

module.exports = function ErrorHandler(err, req, res, next) {
  // console.log(err);
  switch (err.name) {
    case FILE_TOO_BIG:
      data = {
        code: 503,
        name: FILE_TOO_BIG,
        message: "Your file size is too big, max file size allowed is 16 MB",
      };
      break;
    case DATA_EXIST:
      data = {
        code: 409,
        name: DATA_EXIST,
        message: `${err.data} already exists!`,
      };
      break;
    case DATA_NOT_FOUND:
      data = {
        code: 404,
        name: DATA_NOT_FOUND,
        message: "Data not Found!",
      };
      break;
    case KADIN_ONLY:
      data = {
        code: 404,
        name: KADIN_ONLY,
        message: "Not Kadin Indonesia!",
      };
      break;

    default:
      data = {
        code: err?.response?.status || 500,
        name: err?.message || "ISE",
        message: Array.isArray(err?.errors)
          ? err.errors?.map((el) => el.message)
          : err?.response?.data?.message || "INTERNAL SERVER ERROR",
      };
      break;
  }
  loggerError({ code: data.code, message: data.message });
  res.status(data.code).json({ message: data.message });
};
