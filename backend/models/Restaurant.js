const mongoose = require("mongoose");
const restaurantSchema = new mongoose.Schema({
  restaurant_id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  country_code: { type: Number },
  city: { type: String },
  address: { type: String },
  locality: { type: String },
  locality_verbose: { type: String },
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }, 
  },
  cuisines: { type: String },
  average_cost_for_two: { type: Number },
  currency: { type: String },
  has_table_booking: { type: Boolean },
  has_online_delivery: { type: Boolean },
  is_delivering_now: { type: Boolean },
  switch_to_order_menu: { type: Boolean },
  price_range: { type: Number },
  aggregate_rating: { type: Number },
  rating_color: { type: String },
  rating_text: { type: String },
  votes: { type: Number },
  featured_image: { type: String },
  menu_images: [{ type: String }],
  event_images: [{ type: String }],
});
restaurantSchema.index({ location: "2dsphere" });
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
