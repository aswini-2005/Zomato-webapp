const express = require("express");
const multer = require("multer");
const axios = require("axios");
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");  
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;
const CLARIFAI_URL = "https://api.clarifai.com/v2/models/food-item-recognition/outputs";

router.get('/location', async (req, res) => {
  try {
    const { lat, lng, radius = 3000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: "Latitude and Longitude are required." });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInMeters = parseFloat(radius);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ success: false, error: "Invalid latitude or longitude." });
    }

    console.log(`Searching for restaurants within ${radiusInMeters}m of (${latitude}, ${longitude})`);

    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: radiusInMeters
        }
      }
    });

    res.json({ success: true, data: restaurants });
  } catch (err) {
    console.error("Error in location search:", err);
    res.status(500).json({ success: false, error: 'Error performing location search' });
  }
});

router.get("/", async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 12;
    let search = req.query.search || "";
    let skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" }; 
    }

    let total = await Restaurant.countDocuments(query);
    let data = await Restaurant.find(query).skip(skip).limit(limit);

    res.json({ total, data });
  } catch (error) {
    res.status(500).json({ error: "Error fetching restaurants" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid Restaurant ID" });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ success: false, error: "Restaurant not found" });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

const foodToCuisineMap = {
  bread: "Continental",
  pasta: "Italian",
  pizza: "Italian",
  noodles: "Chinese",
  dumpling: "Chinese",
  burger: "American",
  sandwich: "Continental",
  rice: "Asian",
  sushi: "Japanese",
  curry: "Indian",
  taco: "Mexican",
  burrito: "Mexican",
  enchilada: "Mexican",
  ramen: "Japanese",
  tempura: "Japanese",
  pho: "Vietnamese",
  banh_mi: "Vietnamese",
  kimchi: "Korean",
  bibimbap: "Korean",
  bulgogi: "Korean",
  dosa: "Indian",
  samosa: "Indian",
  biryani: "Indian",
  falafel: "Middle Eastern",
  hummus: "Middle Eastern",
  kebab: "Middle Eastern",
  shawarma: "Middle Eastern",
  paella: "Spanish",
  tapas: "Spanish",
  croissant: "French",
  baguette: "French",
  escargot: "French",
  goulash: "Hungarian",
  pierogi: "Polish",
  schnitzel: "German",
  bratwurst: "German",
  poutine: "Canadian",
  cheesecake: "American",
  hot_dog: "American",
  steak: "American",
  fish_and_chips: "British",
  black_pudding: "British",
  shepherds_pie: "British",
  borscht: "Russian",
  blini: "Russian",
  stroganoff: "Russian",
  feijoada: "Brazilian",
  empanada: "Argentinian",
  ceviche: "Peruvian",
  mochi: "Japanese",
  yakitori: "Japanese",
  miso_soup: "Japanese",
  tom_yum: "Thai",
  pad_thai: "Thai",
  laksa: "Malaysian",
  rendang: "Indonesian",
};


router.post("/image-search", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image uploaded" });
    }
    const base64Image = req.file.buffer.toString("base64");
    const response = await axios.post(CLARIFAI_URL,
      { inputs: [{ data: { image: { base64: base64Image } } }] },
      { headers: { Authorization: `Key ${CLARIFAI_API_KEY}`, "Content-Type": "application/json" } }
    );
    if (!response.data.outputs || !response.data.outputs[0].data || !response.data.outputs[0].data.concepts) {
      return res.status(500).json({ success: false, error: "Invalid API response from Clarifai" });
    }
    const predictions = response.data.outputs[0].data.concepts;
    const foodItems = predictions.filter(p => p.value > 0.8).map(p => p.name);
    const matchedCuisines = new Set();
    foodItems.forEach(food => {
      if (foodToCuisineMap[food]) {
        matchedCuisines.add(foodToCuisineMap[food]);
      }
    });
    const matchingRestaurants = await Restaurant.find({
      cuisines: { $in: Array.from(matchedCuisines) }
    });
    console.log("Predicted food items:", foodItems);
    console.log("Mapped cuisines:", matchedCuisines);
    console.log("Querying restaurants with:", { cuisines: { $in: Array.from(matchedCuisines) } });
    console.log("Found restaurants:", matchingRestaurants);
    res.json({ success: true, predicted_food: foodItems, matched_cuisines: Array.from(matchedCuisines), matching_restaurants: matchingRestaurants });
  } catch (error) {
    console.error("Error in image search:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
module.exports = router;  
