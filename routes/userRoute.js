const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { authenticate } = require("../middlewares/authenticate.middleware");
dotenv.config();

const { UserModel } = require("../models/user.model");


const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
    try {
        let users = await UserModel.find();
        res.json(users);
    } catch (error) {
        res.json(error);
    }
})

userRouter.post("/register", async (req, res) => {
    let { name, email, password, address } = req.body;
    try {
        bcrypt.hash(password, 5, async (err, hashed_password) => {
            if (hashed_password) {
                let user = new UserModel({ name, email, password: hashed_password, address });
                await user.save();
                res.status(201).json("user registered successfully");
            } else {
                res.json(err);
            }
        });

    } catch (error) {
        console.log(error);
        res.json(error);
    }
})

userRouter.post("/login", async (req, res) => {
    let { email, password } = req.body;
    if (email && password) {
        let user = await UserModel.findOne({ email });
        if (user) {
            hashed_password = user.password;
            try {
                bcrypt.compare(password, hashed_password, async (err, result) => {
                    if (result) {
                        let token = jwt.sign({ userID: user._id }, process.env.key);
                        res.status(201).json({ status: "Login Successfull", token });
                    } else {
                        res.json("incorrect password");
                    }
                })
            } catch (error) {
                console.log(error);
                res.json(error);
            }
        }
        else res.json("no users found create a new user");
    } else {
        res.json("enter valid credentials or register first");
    }
})

userRouter.patch("/user/:id/reset", async (req, res) => {
    try {
        let id = req.params.id;
        let { old_pass, new_pass } = req.body;
        let user = await UserModel.findOne({ _id: id });
        bcrypt.compare(old_pass, user.password, async (err, result) => {
            if (result) {
                // hasing and storing new password
                bcrypt.hash(new_pass, 5, async (err, hashed_password) => {
                    user.password = hashed_password;
                    if (hashed_password) {
                        await UserModel.findByIdAndUpdate({ _id: id }, user);
                        res.status(201).json("user password changed successfully");
                    } else {
                        res.json("error in hasing new password", err);
                    }
                });

            } else {
                res.json("old password is incorrect");
            }
        });

    } catch (error) {

    }
})


module.exports = { userRouter }