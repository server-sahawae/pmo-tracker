const bcrypt = require("bcryptjs");
const { BAD_REQUEST } = require("../constants/ErrorKeys");

function hash(value) {
  if (value) {
    return bcrypt.hashSync(value.toString(), 10);
  } else throw { name: BAD_REQUEST };
}

function compareHash(value, encryptedValue) {
  return bcrypt.compareSync(value.toString(), encryptedValue);
}
module.exports = { hash, compareHash };
