const express = require("express");

const fs = require("fs");
const path = require("path");

const { verificaToken, verificaTokenImg } = require("../middlewares/authentication");

let app = express();


app.get("/imagen/:tipo/:img", verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImgPath = path.resolve(__dirname, "../assets/original.jpg");
        res.sendFile(noImgPath);
    }


});


module.exports = app;