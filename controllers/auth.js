const fs = require("fs");
const { response } = require("express");
const AppleAuth = require("apple-auth");
const jwt = require("jsonwebtoken");
const { validateGoogleIdToken } = require("../helpers/google_verify_token");

const googleAuth = async (req, res = response) => {
  //TODO: obtener el token de google
  const token = req.body.token;
  if (!token) {
    return res.json({
      ok: false,
      message: "No token provided",
    });
  }
  //usar la validación de google para verificar el token y obtener el payload
  const googleUser = await validateGoogleIdToken(token);

  if (!googleUser) {
    return res.status(400).json({
      ok: false,
      message: "Invalid token",
    });
  }

  //TODO:guardar en la base de datos

  res.json({
    ok: true,
    googleUser,
  });
};
//Callback para Apple
const callBackApple = async (request, response) => {
  try {
    const redirect = `intent://callback?${new URLSearchParams(
      request.body
    ).toString()}#Intent;package=${
      process.env.ANDROID_PACKAGE_IDENTIFIER
    };scheme=signinwithapple;end`;

    console.log(`Redirecting to ${redirect}`);

    response.redirect(307, redirect);
  } catch (error) {
    console.log(`Callback error: ${error}`);
  }
};

//signin para apple
const signInWithApple = async (request, response) => {
  try {
    const auth = new AppleAuth(
      {
        // use the bundle ID as client ID for native apps, else use the service ID for web-auth flows
        // https://forums.developer.apple.com/thread/118135
        client_id:
          request.query.useBundleId === "true"
            ? process.env.BUNDLE_ID
            : process.env.SERVICE_ID,
        team_id: process.env.TEAM_ID,
        redirect_uri:
          "https://apple-google-signin-serv.herokuapp.com/callbacks/sign_in_with_apple", // does not matter here, as this is already the callback that verifies the token after the redirection
        key_id: process.env.KEY_ID,
      },
      process.env.KEY_CONTENTS.replace(/\|/g, "\n"),
      "text"
    );

    console.log(request.query);

    const accessToken = await auth.accessToken(request.query.code);

    const idToken = jwt.decode(accessToken.id_token);

    const userID = idToken.sub;

    console.log(idToken);

    // `userEmail` and `userName` will only be provided for the initial authorization with your app
    const userEmail = idToken.email;
    const userName = `${request.query.firstName} ${request.query.lastName}`;

    // 👷🏻‍♀️ TODO: Use the values provided create a new session for the user in your system
    const sessionID = `NEW SESSION ID for ${userID} / ${userEmail} / ${userName}`;

    console.log(`sessionID = ${sessionID}`);

    response.json({ sessionId: sessionID });
  } catch (error) {
    console.log(`signInWithApple error: ${error}`);
  }
};

module.exports = { googleAuth, callBackApple, signInWithApple };
