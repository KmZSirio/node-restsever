const express = require("express");
const _ = require("underscore");

const { verificaToken } = require("../middlewares/authentication");

let app = express();

let Producto = require("../models/producto");


app.get("/productos", verificaToken, (req, res) => {
    // Trae todos los productos, con el populate cargar usuario y categoria, paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let porPagina = req.query.porPagina || 5;
    porPagina = Number(porPagina);

    Producto.find({ disponible: true }, )
        .skip(desde)
        .limit(porPagina)
        .sort("nombre")
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                });
            })

        });

});


app.get("/productos/:id", verificaToken, (req, res) => {
    // Trae el producto, con el populate cargar usuario y categoria
    let id = req.params.id;


    Producto.find({ _id: id, disponible: true }, )
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});


app.get("/productos/buscar/:termino", verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Producto.find({ nombre: regex })
        .populate("categoria", "descripcion")
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        });


});


app.post("/productos", verificaToken, (req, res) => {
    // Grabar usuario, grabar categoria
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        disponible: body.disponible,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no encontrado"
                }
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});


app.put("/productos/:id", verificaToken, (req, res) => {
    // Actualizar por id
    let id = req.params.id;
    let body = _.pick(req.body, ["nombre", "precioUni", "descripcion"]);

    Producto.findByIdAndUpdate(id, body, { new: true, useFindAndModify: false }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});


app.delete("/productos/:id", verificaToken, (req, res) => {
    // Borrado del estado del producto
    let id = req.params.id;

    let cambiaDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        });
    });

});




module.exports = app;