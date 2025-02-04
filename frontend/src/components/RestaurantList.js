import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Optional: For filters
  const [filters, setFilters] = useState({
    country: '',
    avgCost: '',
    cuisines: '',
    search: '',
    lat: '',
    lng: ''
  });

  // Fetch restaurants on page or filter change
  useEffect(() => {
    let endpoint = 'http://localhost:5000/api/restaurants';
    let params = { page, limit, ...filters };

    // If latitude and longitude are provided, search by location
    if (filters.lat && filters.lng) {
      endpoint = 'http://localhost:5000/api/restaurants/search/location';
    }

    axios.get(endpoint, { params })
      .then(response => setRestaurants(response.data))
      .catch(error => console.error('Error fetching restaurants:', error));
  }, [page, filters]);

  return (
    <div className="container">
      <h2>Restaurant List</h2>
      {/* Filter Inputs */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Country Code" 
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <input 
          type="text" 
          placeholder="Avg Cost" 
          value={filters.avgCost}
          onChange={(e) => setFilters({ ...filters, avgCost: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <input 
          type="text" 
          placeholder="Cuisines" 
          value={filters.cuisines}
          onChange={(e) => setFilters({ ...filters, cuisines: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <input 
          type="text" 
          placeholder="Search by name/address" 
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <input 
          type="text" 
          placeholder="Latitude" 
          value={filters.lat}
          onChange={(e) => setFilters({ ...filters, lat: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <input 
          type="text" 
          placeholder="Longitude" 
          value={filters.lng}
          onChange={(e) => setFilters({ ...filters, lng: e.target.value })}
          style={{ marginRight: '10px' }}
        />
        <button className="button" onClick={() => setPage(1)}>Apply Filters</button>
      </div>

      <div className="restaurant-list">
        <ul>
          {restaurants.map(restaurant => (
            <li key={restaurant.restaurant_id}>
              <Link to={`/restaurant/${restaurant.restaurant_id}`}>
                {restaurant.name}
              </Link>
              <Link to={`/restaurant/${restaurant.restaurant_id}`}>
                <button className="button">View</button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Pagination */}
      <div style={{ marginTop: '20px' }}>
        <button className="button" onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>
          Prev
        </button>
        <span style={{ margin: '0 15px' }}>Page {page}</span>
        <button className="button" onClick={() => setPage(prev => prev + 1)}>
          Next
        </button>
      </div>

      {/* Use Current Location */}
      <button className="button" onClick={() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            setFilters({
              ...filters,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          }, (error) => {
            console.error("Error getting location:", error);
          });
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      }}>
        Use My Location
      </button>
    </div>
  );
};

export default RestaurantList;
