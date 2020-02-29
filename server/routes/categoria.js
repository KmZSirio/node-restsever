const express = require("express");
const _ = require("underscore");

const { verificaToken, verificaAdmin_Role } = require("../middlewares/authentication");

let app = express();

let Categoria = require("../models/categoria");



app.get("/categoria", verificaToken, (req, res) => {
    // Que aparezcan todas las categorias, paginar opcional
    Categoria.find({}, "descripcion usuario")
        .sort("descripcion")
        .populate("usuario", "nombre email")
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    conteo
                });
            })

        });

});


app.get("/categoria/:id", verificaToken, (req, res) => {
    // Mostrar una categoria por ID
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrada"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


app.post("/categoria", verificaToken, (req, res) => {
    // Crear nueva categoria y regresarla
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrada"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


app.put("/categoria/:id", verificaToken, (req, res) => {
    // Actualizar esta categoria, solo la descripcion
    let id = req.params.id;
    let body = _.pick(req.body, ["descripcion"]);

    Categoria.findByIdAndUpdate(id, body, { new: true, useFindAndModify: false }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


app.delete("/categoria/:id", [verificaToken, verificaAdmin_Role], (req, res) => {
    // Solo un admin puede borrar, sera eliminado fisico
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: "Categoria borrada"
        });

    });

});



module.exports = app;