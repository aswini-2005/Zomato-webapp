const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Restaurant = require('./models/Restaurant.js');
const MONGO_URI = 'mongodb://localhost:27017/Zomato'; 
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
const dataFolder = path.join(__dirname, 'data'); 
const jsonFiles = ['file1.json', 'file2.json', 'file3.json', 'file4.json', 'file5.json'];
const importData = async () => {
  try {
    for (const file of jsonFiles) {
      const filePath = path.join(dataFolder, file);
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (!Array.isArray(jsonData)) {
        console.error(`Skipping ${file}: Data is not an array`);
        continue;
      }
      await Restaurant.insertMany(jsonData, { ordered: false });
      console.log(`${file} imported successfully.`);
    }
    console.log('All files imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    mongoose.connection.close();
  }
};
importData();
