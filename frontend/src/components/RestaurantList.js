import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './RestaurantList.css';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState(3000);
  const [image, setImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();
  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await axios.get("https://zomato-webapp-r2d8.onrender.com/api/restaurants", {
        params: { page: currentPage, limit: itemsPerPage, search: searchQuery },
      });
      setRestaurants(res.data.data);
      setTotalPages(Math.ceil(res.data.total / itemsPerPage));
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  }, [currentPage, searchQuery]);
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]); 
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  useEffect(() => {
    fetchRestaurants();
  }, [searchQuery, fetchRestaurants]);
  const handleLocationSearch = async () => {
    if (!latitude || !longitude) return alert("Enter latitude & longitude");
    try {
      const res = await axios.get("https://zomato-webapp-r2d8.onrender.com/api/restaurants/location", {
        params: { lat: latitude, lng: longitude, radius, page: currentPage, limit: itemsPerPage },
      });
      setRestaurants(res.data.data);
      setTotalPages(Math.ceil(res.data.total / itemsPerPage));
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching by location:", error);
    }
  };
  const handleImageSearch = async () => {
    if (!image) return alert("Please upload an image");
    const formData = new FormData();
    formData.append("image", image);
    try {
      const res = await axios.post("https://zomato-webapp-r2d8.onrender.com/api/restaurants/image-search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRestaurants(res.data.matching_restaurants);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching by image:", error);
    }
  };
  return (
    <div className="container">
        <div style={{ color: "white", fontSize: "40px", backgroundColor: "red",margin:"10px" }}>
          Zomato
        </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter restaurant name"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="filters">
        <input type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        <input type="number" placeholder="Radius (meters)" value={radius} onChange={(e) => setRadius(e.target.value)} />
        <button onClick={handleLocationSearch}>Apply Location Filter</button>
      </div>
      <div className="image-search">
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={handleImageSearch} className="image-search-button">Search by Image</button>
      </div>
      <div className="restaurant-grid">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <div key={restaurant._id} className="restaurant-card" onClick={() => navigate(`/restaurant/${restaurant._id}`)}>
              <img src={restaurant.featured_image || "placeholder.jpg"} alt={restaurant.name} />
              <h3>{restaurant.name}</h3>
              <p>{restaurant.city}</p>
              <p>Rating: {restaurant.aggregate_rating} ⭐ ({restaurant.votes} votes)</p>
            </div>
          ))
        ) : (
          <p>No restaurants found</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};
export default RestaurantList;
