const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "303731567125-jti0aphqut0nd9hhv7nj14co3v5q3si4.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const validateGoogleIdToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [
        CLIENT_ID,
        "303731567125-cvs7a65jp3q13pgdmefc9bufn7n1kj6q.apps.googleusercontent.com",
        "303731567125-gslccigd1fv5eqvok1sg6n8e9qgk7ldu.apps.googleusercontent.com",
      ], // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //   const userid = payload["sub"];
    //   console.log(payload);
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
      name: payload["name"],
      email: payload["email"],
      picture: payload["picture"],
    };
  } catch (error) {
    return null;
  }
};

module.exports = { validateGoogleIdToken };
