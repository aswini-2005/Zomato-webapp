const fs = require('fs');
const path = require('path');
const dataFolderPath = path.join(__dirname, 'data'); 
const updateJsonFiles = async () => {
    try {
        const files = fs.readdirSync(dataFolderPath);
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const filePath = path.join(dataFolderPath, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                const updatedData = data.map(item => ({
                    ...item,
                    image_url: item.image_url || `https://example.com/images/${item.restaurant_id}.jpg`
                }));
                fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');
                console.log(`Updated ${file}`);
            }
        });
        console.log("All JSON files updated successfully!");
    } catch (error) {
        console.error("Error updating JSON files:", error);
    }
};
updateJsonFiles();
