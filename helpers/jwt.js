const jwt = require("jsonwebtoken");
const { encryptData, decryptData } = require("./encryptDecrypt");
const keys = process.env.JWT_TOKEN;
const googleKey = process.env.GOOGLE_KEY;

function createToken(data, staySignedIn) {
  let result;
  if (!staySignedIn) {
    result = jwt.sign({ ...data, staySignedIn: false }, keys, {
      expiresIn: "24h",
    });
  } else result = jwt.sign({ ...data, staySignedIn }, keys);
  return encryptData(result);
}

function verifyToken(token) {
  token = decryptData(token);
  return jwt.verify(token, keys);
}

module.exports = { createToken, verifyToken };
