const express = require('express');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

// Get a Restaurant by Custom Restaurant ID (restaurant_id)
router.get('/restaurant/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const restaurant = await Restaurant.findOne({ restaurant_id: id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching restaurant', error: err });
  }
});

// Get List of Restaurants with Pagination & Filtering Options
router.get('/restaurants', async (req, res) => {
  const { page = 1, limit = 10, country, avgCost, cuisines, search } = req.query;
  const query = {};

  // Filter by country 
  if (country) {
    query.country_code = Number(country);
  }

  // Filter by average cost for two 
  if (avgCost) {
    query.average_cost_for_two = Number(avgCost);
  }

  // Filter by cuisines 
  if (cuisines) {
    query.cuisines = { $regex: cuisines, $options: 'i' };
  }

  // Search by restaurant name or address 
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;
  try {
    const restaurants = await Restaurant.find(query)
      .skip(Number(skip))
      .limit(Number(limit));
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching restaurants', error: err });
  }
});

router.get('/restaurants/search/location', async (req, res) => {
  const { lat, lng, radius = 3000 } = req.query; // radius in meters (default 3000 m)
  try {
    const latitude = Number(lat);
    const longitude = Number(lng);
    const maxLat = latitude + 0.03;
    const minLat = latitude - 0.03;
    const maxLng = longitude + 0.03;
    const minLng = longitude - 0.03;

    const restaurants = await Restaurant.find({
      latitude: { $gte: minLat, $lte: maxLat },
      longitude: { $gte: minLng, $lte: maxLng }
    });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: 'Error performing location search', error: err });
  }
});

router.post('/restaurants/search/image', async (req, res) => {
  const { cuisine } = req.body; 
  try {
    const restaurants = await Restaurant.find({
      cuisines: { $regex: cuisine, $options: 'i' }
    });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: 'Error performing image search', error: err });
  }
});

module.exports = router;
