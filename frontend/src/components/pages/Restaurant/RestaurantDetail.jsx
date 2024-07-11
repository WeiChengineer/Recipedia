import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import SectionWrapper from "../../common/SectionWrapper";
import Swal from "sweetalert2";
import StarRatings from "react-star-ratings";

const RestaurantDetail = () => {
  const navigate = useNavigate();
  let { slug } = useParams();

  const [restaurant, setRestaurant] = useState({});
  const [recipes, setRecipes] = useState()

  // const getRecipes = async () =>{
  //   const response = await fetch('http://localhost:3000/recipes');
  //   const data = await response.json();
  //   setRecipes(data);
  // }

  useEffect(() => {
    // getRecipes();

    fetch(`http://localhost:3000/restaurants/${slug}`)
      .then(response => response.json())
      .then(data => {
        setRestaurant(data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  })

  const deleteRestaurant = async () => {
    try {
      const response = await fetch(`http://localhost:3000/restaurants/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Restaurant has been deleted.',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        navigate('/restaurant');


      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete restaurant.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        navigate('/restaurant');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete restaurant.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      navigate('/restaurant');
    }
  }

  return (
    <SectionWrapper>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-5">
        <div className="sm:flex">
          <div className="sm:flex-shrink-0">
            <img className="h-48 w-full object-cover sm:h-96 sm:w-96" src={restaurant.image} alt={restaurant.name} />
          </div>
          <div className="p-6">
            <label htmlFor="" className="block mt-1 text-lg leading-tight font-medium text-black">Restaurant</label>
            <h1 className="my-1 indent-6 text-gray-700">{restaurant.name}</h1>
            <label htmlFor="" className="block mt-1 text-lg leading-tight font-medium text-black">Location</label>
            <p className="my-1 indent-6 text-gray-700">{restaurant.location}</p>
            <label htmlFor="" className="block mt-1 text-lg leading-tight font-medium text-black">Description</label>
            <p className="my-1 indent-6 text-gray-700">{restaurant.notes}</p>
            <label htmlFor="" className="block mt-1 text-lg leading-tight font-medium text-black">Cuisine Type</label>
            <div className="my-1 indent-6 text-gray-700">{restaurant.cuisineType}</div>
            <label htmlFor="" className="block mt-1 text-lg leading-tight font-medium text-black">Rating </label>
            <div className="my-1 flex items-center">
              <StarRatings
                rating={restaurant.rating}
                starRatedColor="gold"
                numberOfStars={5}
                starDimension="30px"
                starSpacing="1px"
              />

            </div>
          </div>
        </div>

        <div className="flex justify-between flex-col sm:flex-row gap-7 my-4">
          <div className="flex flex-row gap-3">
            <p className="rounded-2xl text-lg font-bold px-3 py-2 bg-slate-400 ">{restaurant.name}</p>
            <p className="rounded-2xl text-lg font-bold px-3 py-2 bg-slate-400 ">{restaurant.location}</p>
            <p className="rounded-2xl text-lg font-bold px-3 py-2 bg-slate-400 ">{restaurant.cuisineType}</p>
            {/* <Link to={`/restaurant/restaruantReview/${slug}`} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-3 py-2">
              Reviews
            </Link> */}
          </div>

          <div className="flex flex-wrap justify-start">
            <Link to={`/restaurant/updateRestaurant/${slug}`} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
              Edit Restaurant
            </Link>
            <button onClick={deleteRestaurant} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
              Delete Restaurant
            </button>
            <Link to={`/recipes/recipesForm/${slug}`} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
              Add a recipe
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 my-4">
          {/* <div className="rounded-2xl text-lg font-bold px-3 py-2 bg-slate-400 ">
            Lorem ipsum dolor sit amet consectetur.
          </div> */}
        </div>
      </div>
    </SectionWrapper>
  )
}

export default RestaurantDetail
