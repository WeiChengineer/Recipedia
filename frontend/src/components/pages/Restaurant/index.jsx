import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionWrapper from "../../common/SectionWrapper";

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/restaurants')
      .then(response => response.json())
      .then(data => {
        setRestaurants(data);
        console.log("data is ", data)
      })
      .catch(error => console.error('Error fetching restaurants:', error));
  }, []);

  return (
    <SectionWrapper>
      <h1 className='text-center font-bold my-6 text-2xl'>Welcome to Restaurant Management System</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="border-2 border-black max-h-72 overflow-y-auto rounded-2xl p-3">
          <h1 className='text-lg  md:text-2xl lg:text-4xl text-center font-bold mb-3'>All RESTAURANTS</h1>
          <ol className="list-decimal list-inside px-3  font-bold">
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <Link to={`/restaurant/restaurantDetail/${restaurant.id}`} className='text-blue-600'>
                  {restaurant.name}
                </Link>
              </li> 
            ))}
          </ol>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Link to="/restaurant/addRestaurant" className="text-white text-center bg-blue-700 col-span-2 hover:bg-blue-800 focus:ring-4 outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Add New Restaurant</Link>
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="flex items-center border-2 border-slate-100 gap-5 shadow-2xl rounded-2xl p-4">
                <img src={restaurant.image} alt="Restaurant Image" className='w-14 h-14 object-cover' />
                <Link to={`/restaurant/restaurantDetail/${restaurant.id}`} className='text-blue-600'>
                  {restaurant.name}
                </Link>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Restaurant;
