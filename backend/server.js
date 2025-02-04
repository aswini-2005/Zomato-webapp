const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const restaurantRoutes = require('./routes/restaurantRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (if not already connected)
mongoose.connect('mongodb://localhost:27017/Zomato', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB error', err));

// Use our API routes under the "/api" prefix
app.use('/api', restaurantRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
