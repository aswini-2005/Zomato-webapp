import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RestaurantDetail.css"; 
const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
        setRestaurant(res.data.data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };
    fetchRestaurant();
  }, [id]);
  if (!restaurant) return <h2 className="restaurant-info-1">Loading...</h2>;
  return (
    <div className="restaurant-container-1">
      <div className="restaurant-card-1">
        <h2 className="restaurant-name-1">{restaurant.name}</h2>
        <img
          src={restaurant.featured_image || "/placeholder.jpg"}
          alt={restaurant.name}
        />
        <p className="restaurant-info-1"><strong>📍 Address:</strong> {restaurant.address}, {restaurant.city}</p>
        <p className="restaurant-info-1"><strong>🍽️ Cuisines:</strong> {restaurant.cuisines}</p>
        <p className="restaurant-info-1"><strong>💰 Cost for Two:</strong> {restaurant.average_cost_for_two} {restaurant.currency}</p>
        <div className="restaurant-info-1">
          <strong>⭐ Rating:</strong> {restaurant.aggregate_rating} 
          <span className="rating-badge-1">{restaurant.votes} votes</span>
        </div>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default RestaurantDetails;
