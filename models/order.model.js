const mongoose = require("mongoose");

const { UserModel } = require("./user.model");
const { RestaurantModel } = require("./restaurant.model");

let ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = mongoose.Schema({
    user: { type: ObjectId, ref: UserModel },
    restaurant: { type: ObjectId, ref: RestaurantModel },
    items: [{
        name: String,
        price: Number,
        quantity: Number
    }],
    totalPrice: Number,
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String
    },
    status: {
        type: String, 
        enum: ["placed", "preparing", "on the way", "delivered"],
        default: "placed"
    }
});

const OrderModel = mongoose.model("order", orderSchema);

module.exports = { OrderModel }