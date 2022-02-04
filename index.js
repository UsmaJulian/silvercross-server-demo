const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

//parsear el body para mostrar la respuesta
app.use(bodyParser.urlencoded({ extended: true }));
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

//informar sobre la disposición de nuevas rutas al server
//RUTAS
// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
app.use("/", require("./routes/auth"));

app.listen(process.env.PORT || 3000, () => {
  const port = process.env.PORT || 3000;

  console.log(`Server is running on port ${port}`);
});
