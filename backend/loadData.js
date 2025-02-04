const mongoose = require('mongoose');
const csvtojson = require('csvtojson');
const path = require('path');
const Restaurant = require('./models/Restaurant');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Zomato', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Path to the CSV file (adjust the filename if needed)
const csvFilePath = path.join(__dirname, 'data', 'zomato.csv');

// Function to convert CSV data to JSON and insert into MongoDB
csvtojson()
  .fromFile(csvFilePath)
  .then(restaurants => {
    // Map and transform the CSV fields to match your schema.
    const formattedRestaurants = restaurants.map(item => {
      return {
        restaurant_id: Number(item["Restaurant ID"]),
        name: item["Restaurant Name"],
        country_code: Number(item["Country Code"]),
        city: item["City"],
        address: item["Address"],
        locality: item["Locality"],
        locality_verbose: item["Locality Verbose"],
        longitude: Number(item["Longitude"]),
        latitude: Number(item["Latitude"]),
        cuisines: item["Cuisines"],
        average_cost_for_two: Number(item["Average Cost for two"]),
        currency: item["Currency"],
        // Convert "Yes"/"No" to boolean
        has_table_booking: item["Has Table booking"].toLowerCase() === 'yes',
        has_online_delivery: item["Has Online delivery"].toLowerCase() === 'yes',
        is_delivering_now: item["Is delivering now"].toLowerCase() === 'yes',
        switch_to_order_menu: item["Switch to order menu"].toLowerCase() === 'yes',
        price_range: Number(item["Price range"]),
        aggregate_rating: Number(item["Aggregate rating"]),
        rating_color: item["Rating color"],
        rating_text: item["Rating text"],
        votes: Number(item["Votes"])
      };
    });

    // Insert the formatted data into MongoDB
    Restaurant.insertMany(formattedRestaurants)
      .then(() => {
        console.log('Data loaded successfully!');
        mongoose.connection.close();
      })
      .catch(err => {
        console.error('Error inserting data:', err);
        mongoose.connection.close();
      });
  })
  .catch(err => {
    console.error('Error converting CSV to JSON:', err);
  });
