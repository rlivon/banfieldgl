const {Schema, model } = require('mongoose');


const Photo = new Schema({
    title: String,
    description: String,
    categoria: String,
    precio: String,
    urlVenta: String,
    imageURL: String,
    public_id: String,
});

module.exports = model('Photo', Photo);