const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String
});

const MenuModel = mongoose.model("menu", menuSchema);

module.exports = { MenuModel }