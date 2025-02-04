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
  // Extract query parameters for pagination and filtering
  const { page = 1, limit = 10, country, avgCost, cuisines, search } = req.query;
  const query = {};

  // Filter by country (assuming "country_code" corresponds to the country)
  if (country) {
    query.country_code = Number(country);
  }

  // Filter by average cost for two (you can add a range filter if needed)
  if (avgCost) {
    query.average_cost_for_two = Number(avgCost);
  }

  // Filter by cuisines (search for substring in the cuisines string)
  if (cuisines) {
    query.cuisines = { $regex: cuisines, $options: 'i' };
  }

  // Search by restaurant name or address (or description if available)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } }
      // Add additional fields if required (like description)
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

// Location Search: Find restaurants within a given radius (in meters) of a latitude/longitude
// Note: For this to work efficiently, you might need to store a GeoJSON field in your schema.
// For now, we'll do a simple numerical comparison.
router.get('/restaurants/search/location', async (req, res) => {
  const { lat, lng, radius = 3000 } = req.query; // radius in meters (default 3000 m)
  try {
    // For a proper geospatial search, convert lat/lng to numbers and use a geospatial query.
    // This example assumes you are storing numeric latitude and longitude.
    const latitude = Number(lat);
    const longitude = Number(lng);
    // A simple "bounding box" approach (approximate)
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

// Image Search: (Simplified Example)
// This endpoint assumes you use an image recognition API to extract cuisines from an image.
// For now, we'll accept a "cuisine" parameter as a placeholder.
router.post('/restaurants/search/image', async (req, res) => {
  // In a real application, you would use multer to handle file upload and a vision API.
  const { cuisine } = req.body; // Placeholder: In production, process the image to get cuisine info.
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
