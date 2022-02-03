const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

//parsear el body para mostrar la respuesta
app.use(bodyParser.urlencoded({ extended: true }));

//informar sobre la disposición de nuevas rutas al server
//RUTAS
app.use("/", require("./routes/auth"));

app.listen(process.env.PORT || 3000, () => {
  const port = process.env.PORT || 3000;

  console.log(`Server is running on port ${port}`);
});
