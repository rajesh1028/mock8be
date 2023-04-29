const express = require("express");
const { RestaurantModel } = require("../models/restaurant.model");
const { MenuModel } = require("../models/menu.model");

const restaurantRouter = express.Router();

restaurantRouter.get("/restaurants", async (req, res) => {
    try {
        let restaurants = await RestaurantModel.find().populate("menu");
        res.json(restaurants);
    } catch (error) {
        res.json(error);
    }
})

restaurantRouter.get("/restaurants/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let restaurants = await RestaurantModel.findOne({ _id: id }).populate("menu");
        res.status(200).json(restaurants);
    } catch (error) {
        res.json(error);
    }
})


restaurantRouter.get("/restaurants/:id/menu", async (req, res) => {
    try {
        let id = req.params.id;
        let restaurants = await RestaurantModel.findOne({ _id: id }).populate("menu");
        res.status(200).json(restaurants.menu);
    } catch (error) {
        res.json(error);
    }
})

restaurantRouter.post("/restaurants/:id/menu", async (req, res) => {
    try {
        let id = req.params.id;
        let menus = await MenuModel.insertMany(req.body);
        // console.log(menus);

        let restaurants = await RestaurantModel.findOne({ _id: id });
        menus.forEach((elem, i) => {
            restaurants.menu.push(elem._id);
        })

        await RestaurantModel.findByIdAndUpdate({ _id: id }, restaurants);

        res.status(201).json("menu added to the restaurants");
    } catch (error) {
        res.json(error);
    }
})

restaurantRouter.delete("/restaurants/:id/menu/:menuid", async (req, res) => {
    try {
        let id = req.params.id;
        let menu_id = req.params.menuid;

        await MenuModel.findByIdAndDelete({ _id: menu_id });

        let restaurants = await RestaurantModel.findOne({ _id: id });
        let menus = restaurants.menu;
        menus.forEach((elem, i) => {
            if (elem._id == menu_id) {
                menus.splice(i, 1);
            }
        })
        restaurants.menu = menus;

        await RestaurantModel.findByIdAndUpdate({ _id: id }, restaurants);

        res.status(202).json("menu removed from the restaurants");
    } catch (error) {
        res.json(error);
    }
})

// posting a new restaurants
restaurantRouter.post("/restaurants", async (req, res) => {
    try {
        let menu = await MenuModel.insertMany(req.body.menu);
        console.log(menu);
        let res_data = {
            "name": req.body.name,
            "address": req.body.address,
            "menu": menu
        };

        let restaurant = new RestaurantModel(res_data);
        restaurant.save();
        res.status(201).json("restaurant created successfully");
    } catch (error) {
        res.json(error);
    }
})

module.exports = { restaurantRouter }







// sample model to add restaurant

// {
//     "name": "jungle",
//     "address": {
//       "street": "123",
//       "city": "koramangala",
//       "state": "karnataka",
//       "country": "India",
//       "zip": "538106"
//     },
//     "menu": [
//       {
//         "name": "aloo makhan",
//         "description": "potato dish",
//         "price": 150,
//         "image": "https://images/aloomakhan.jpg"
//       },
//       {
//         "name": "panner makhan",
//         "description": "panner dish",
//         "price": 150,
//         "image": "https://images/aloomakhan.jpg"
//       },
//       {
//         "name": "grill makhan",
//         "description": "chicken dish",
//         "price": 150,
//         "image": "https://images/aloomakhan.jpg"
//       }
//     ]
//   }


// sample model to add menu to particular restaurant

// [
//     {
//         "name": "tandoori",
//         "description": "chicken dish",
//         "price": 350,
//         "image": "https://images/aloomakhan.jpg"
//     },
//     {
//         "name": "panner masala",
//         "description": "panner dish",
//         "price": 180,
//         "image": "https://images/aloomakhan.jpg"
//     }
// ]