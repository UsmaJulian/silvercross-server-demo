const { response } = require("express");
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

module.exports = { googleAuth };
