// ------
// Puerto
// ------
process.env.PORT = process.env.PORT || 3000;

// ------
// Entorno
// ------
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ------
// DB
// ------
let urlDB;

if (process.env.NODE_ENV === "dev") {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ---------
// Fecha Exp
// ---------
process.env.CADUCIDAD_TOKEN = '1w';

// ------
// Seed
// ------
process.env.SEED = process.env.SEED || "csc";