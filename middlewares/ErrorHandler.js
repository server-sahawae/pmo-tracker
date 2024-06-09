const {
  FILE_TOO_BIG,
  DATA_NOT_FOUND,
  DATA_EXIST,
  KADIN_ONLY,
  NO_AUTHORIZE,
} = require("../constants/ErrorKeys");
const { loggerError } = require("../helpers/loggerDebug");

module.exports = function ErrorHandler(err, req, res, next) {
  // console.log(err.message);
  loggerError(err.name);
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
    case NO_AUTHORIZE:
      data = {
        code: 401,
        name: NO_AUTHORIZE,
        message: "You have no authorization!",
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
  // console.log(err.name);
  loggerError({ code: data.code, name: err.name, message: data.message });
  res.status(data.code).json({ message: data.message });
};
