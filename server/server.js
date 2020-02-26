require("./config/config");
const express = require('express');
const mongoose = require('mongoose');
const path = require("path");

const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Config global de rutas
app.use(require("./routes/index"));

// Habilitar carpeta public para que sea accedida desde cualquier lugar
app.use(express.static(path.resolve(__dirname, "../public")));


mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;

    console.log("Base de datos ONLINE");
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto: ", process.env.PORT);
});