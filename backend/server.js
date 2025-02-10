require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const restaurantRoutes = require("./routes/restaurantRoutes"); 
const app = express();
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB Atlas connection error:", err));
app.use("/api/restaurants", restaurantRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
