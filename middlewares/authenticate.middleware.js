const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
        let decoded = jwt.verify(token, process.env.key);
        if (decoded) {
            let userID = decoded.userID;
            req.body.userID = userID;
            next();
        } else {
            res.json("please login first");
        }
    } else {
        res.json("please login first");
    }
}

module.exports = { authenticate }