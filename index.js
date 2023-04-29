const express = require("express");
const cors = require("cors");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/userRoute");
const { restaurantRouter } = require("./routes/restaurantRoute");
const { orderRouter } = require("./routes/orderRoute");
const { authenticate } = require("./middlewares/authenticate.middleware");


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Home Page");
})


app.use("/api", userRouter);
app.use("/api", authenticate);
app.use("/api", restaurantRouter);
app.use("/api", orderRouter);


app.listen(8000, async () => {
    try {
        await connection;
        console.log("connected to DB");
    } catch (error) {
        console.log(error);
    }
    console.log("server is listening on port 8000");
})