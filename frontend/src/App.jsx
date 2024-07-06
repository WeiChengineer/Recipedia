import Navbar from "./components/common/Navbar";
import Home from "./components/pages/Home";
import Restaurant from "./components/pages/Restaurant"; 
import Recipes from "./components/pages/Recipes";
import Favorites from "./components/pages/Favorites";
import Categories from "./components/pages/Categories";
import { Routes, Route } from "react-router-dom";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import RestaurantForm from "./components/common/forms/RestaurantForm";
import CuisineForm from "./components/common/forms/CuisineForm";
import CuisineDetail from "./components/pages/Categories/CuisineDetail";
import CuisineFormUpdate from "./components/common/forms/CuisineFormUpdate";
import RestaurantDetail from "./components/pages/Restaurant/RestaurantDetail";
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/restaurant" element={<Restaurant />} /> 
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/restaurant/addRestaurant" element={<RestaurantForm />} />
        <Route path="/restaurant/restaurantDetail/:slug" element={<RestaurantDetail />} />
        <Route path="/cuisine/cuisineForm" element={<CuisineForm />} />
        <Route path="/cuisine/updateForm/:slug" element={<CuisineFormUpdate />} />
        <Route path="/cuisine/cuisineDetail/:slug" element={<CuisineDetail />} />
        
        {/* Add more routes here */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
};

export default App;
