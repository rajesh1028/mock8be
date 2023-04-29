const express = require("express");
const { OrderModel } = require("../models/order.model");

const orderRouter = express.Router();

orderRouter.get("/orders", async (req, res) => {
    try {
        let order = await OrderModel.findOne();
        res.status(200).json(order);
    } catch (error) {
        res.json(error);
    }
})

orderRouter.get("/orders/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let order = await OrderModel.findOne({ _id: id });
        res.status(200).json(order);
    } catch (error) {
        res.json(error);
    }
})

orderRouter.post("/orders", async (req, res) => {
    try {
        // let orders = await OrderModel.find().populate("user restaurant");
        let user = req.body.user;
        let restaurant = req.body.restaurant;
        let items = req.body.items;
        let totalPrice = 0;
        items.forEach((elem, i) => {
            totalPrice += elem.price * elem.quantity;
        });
        let deliveryAddress = req.body.deliveryAddress;

        let order = new OrderModel({ user, restaurant, items, totalPrice, deliveryAddress });
        await order.save();
        res.status(201).json("order placed successfully");
    } catch (error) {
        res.json(error);
    }
})

orderRouter.patch("/orders/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let order = await OrderModel.findOne({ _id: id });
        order.status = req.body.status;

        await OrderModel.findByIdAndUpdate({ _id: id }, order);

        res.status(204).json("status updated successfully");
    } catch (error) {
        res.json(error);
    }
})

module.exports = { orderRouter }