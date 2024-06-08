const jwt = require("jsonwebtoken");
const { encryptData, decryptData } = require("./encryptDecrypt");
const keys = process.env.JWT_TOKEN;
const googleKey = process.env.GOOGLE_KEY;

function createToken(data) {
  result = jwt.sign({ ...data }, keys, {
    expiresIn: "7d",
  });
  return result;
  // return encryptData(result);
}

function verifyToken(token) {
  // token = decryptData(token);
  // console.log(jwt.verify(token, keys));
  return jwt.verify(token, keys);
}

module.exports = { createToken, verifyToken };
