import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './RestaurantDetail.css'; // Ensure you have the correct path to your CSS file

const RestaurantDetail = () => {
  const { id } = useParams(); // This uses your custom restaurant_id
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/restaurant/${id}`)
      .then(response => setRestaurant(response.data))
      .catch(error => console.error('Error fetching restaurant detail:', error));
  }, [id]);

  if (!restaurant) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="restaurant-detail">
        <Link to="/" className="link-button">← Back to List</Link>
        <h1>{restaurant.name}</h1>
        
        <div className="details-section">
          <p><strong>Cuisines:</strong> {restaurant.cuisines}</p>
          <p><strong>City:</strong> {restaurant.city}</p>
          <p><strong>Address:</strong> {restaurant.address}</p>
          <p><strong>Average Cost for Two:</strong> {restaurant.average_cost_for_two} {restaurant.currency}</p>
        </div>

        <div className="rating">
          <span>{restaurant.aggregate_rating}</span>
          <span className="rating-text">({restaurant.rating_text})</span>
        </div>
        
        {/* Add more details if necessary */}
      </div>
    </div>
  );
};

export default RestaurantDetail;
