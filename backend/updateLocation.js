const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant'); 
const uri = "mongodb://localhost:27017/Zomato"; 
async function updateRestaurants() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");

    const result = await Restaurant.updateMany({}, [
      { $set: { location: { type: "Point", coordinates: ["$longitude", "$latitude"] } } }
    ]);

    console.log(`✅ Updated ${result.modifiedCount} restaurants.`);
    mongoose.disconnect();
  } catch (err) {
    console.error("Error updating restaurants:", err);
  }
}
updateRestaurants();
