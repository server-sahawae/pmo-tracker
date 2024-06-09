const jwt = require("jsonwebtoken");
const keys = process.env.JWT_TOKEN;

function createToken(data) {
  const result = jwt.sign({ ...data }, keys, {
    expiresIn: "7d",
  });
  console.log(result);
  return result;
  // return encryptData(result);
}

function verifyToken(token) {
  // token = decryptData(token);
  // console.log(jwt.verify(token, keys));
  return jwt.verify(token, keys);
}

module.exports = { createToken, verifyToken };
