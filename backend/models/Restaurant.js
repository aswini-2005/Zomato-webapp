const mongoose = require('mongoose');

// Define the restaurant schema by mapping the CSV columns to schema fields.
const restaurantSchema = new mongoose.Schema({
  restaurant_id: { type: Number, unique: true },           // "Restaurant ID"
  name: { type: String, required: true },                  // "Restaurant Name"
  country_code: { type: Number },                          // "Country Code"
  city: { type: String },                                  // "City"
  address: { type: String },                               // "Address"
  locality: { type: String },                              // "Locality"
  locality_verbose: { type: String },                      // "Locality Verbose"
  longitude: { type: Number },                             // "Longitude"
  latitude: { type: Number },                              // "Latitude"
  cuisines: { type: String },                              // "Cuisines"
  average_cost_for_two: { type: Number },                  // "Average Cost for two"
  currency: { type: String },                              // "Currency"
  has_table_booking: { type: Boolean },                    // "Has Table booking"
  has_online_delivery: { type: Boolean },                  // "Has Online delivery"
  is_delivering_now: { type: Boolean },                    // "Is delivering now"
  switch_to_order_menu: { type: Boolean },                 // "Switch to order menu"
  price_range: { type: Number },                           // "Price range"
  aggregate_rating: { type: Number },                      // "Aggregate rating"
  rating_color: { type: String },                          // "Rating color"
  rating_text: { type: String },                           // "Rating text"
  votes: { type: Number }                                  // "Votes"
});

// Create the model using the schema.
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
