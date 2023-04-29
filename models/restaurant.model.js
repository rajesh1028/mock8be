const mongoose = require("mongoose");

const { MenuModel } = require("./menu.model");
let ObjectId = mongoose.Schema.Types.ObjectId;

const restaurantSchema = mongoose.Schema({
    name: String,
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String
    },
    menu: [{ type: ObjectId, ref: MenuModel }]
});

const RestaurantModel = mongoose.model("restaurant", restaurantSchema);

module.exports = { RestaurantModel }