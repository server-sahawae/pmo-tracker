const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.GOOGLE_CLIEN_ID;

const client = new OAuth2Client();

async function verifyGoogleAuth(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    return ticket;
  } catch (error) {
    // console.log("!!!!!!!!!!!!");
    throw error;
  }
}

module.exports = verifyGoogleAuth;
