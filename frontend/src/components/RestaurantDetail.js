import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

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
    <div className="container restaurant-detail">
      <Link to="/" className="button" style={{ marginBottom: '15px', display: 'inline-block' }}>← Back to List</Link>
      <h1>{restaurant.name}</h1>
      <p><strong>Cuisines:</strong> {restaurant.cuisines}</p>
      <p><strong>City:</strong> {restaurant.city}</p>
      <p><strong>Address:</strong> {restaurant.address}</p>
      <p><strong>Average Cost for Two:</strong> {restaurant.average_cost_for_two} {restaurant.currency}</p>
      <p><strong>Rating:</strong> {restaurant.aggregate_rating} ({restaurant.rating_text})</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default RestaurantDetail;
