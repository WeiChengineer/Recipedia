import { useEffect, useState } from "react";
import SectionWrapper from "../../common/SectionWrapper"
import { Link } from "react-router-dom";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  const getRecipes = async () => {
    const response = await fetch('http://localhost:3000/recipes');
    const data = await response.json();
    console.log(data);
    setRecipes(data);
  }

  useEffect(() => {
    getRecipes();
  }, []);


  return (
    <SectionWrapper>
      <h1 className="text-xl md:text-3xl text-center font-bold">All Recipes are here</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {recipes.map((recipe, index) => (
          <div key={index} className="w-full my-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <img className="w-full h-48 object-cover object-center" src={recipe.image} alt={recipe.name} />
            <div className="p-6">
              <h2 className="text-xl font-bold line-clamp-2 text-gray-800">{recipe.name}</h2>
              <p className="mt-2 text-gray-600 line-clamp-2"><strong>Notes:</strong> {recipe.notes}</p>
            </div>
            <div className="my-5 px-4 flex justify-end">
              <Link to={`/recipes/recipesDetail/${recipe.id}`} className=" bg-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300">
                View Recipe
              </Link>
            </div>


          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

export default Recipes
