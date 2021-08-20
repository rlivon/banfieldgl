const {Schema, model } = require('mongoose');


const Photo = new Schema({
    title: String,
    description: String,
    categoria: String,
    precio: String,
    imageURL: String,
    urlVenta: String,
    public_id: String,
});

module.exports = model('Photo', Photo);