import { useEffect, useState } from "react";
import SectionWrapper from "../../common/SectionWrapper";
import { Link, useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Review from "../Review";
import Swal from "sweetalert2";
import "../../css/common.css";
import "../../css/recipeDetail.css";
import { useCookies } from "react-cookie";
import { useAuthContext } from "../../../../context/Auth";

const RecipeDetail = () => {
  const [cookies] = useCookies();
  const { isUserLoggedIn, checkIsSameUser, loggedInUser } = useAuthContext();
  const navigate = useNavigate();
  let { slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  // const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  // const [isSameUser, setIsSameUser] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [userHasAReview, setUserHasAReview] = useState(false);
  const location = useLocation();

  // const checkUserExist = () => {
  //   return cookies.auth !== "undefined";
  // };

  // const checkSameUser = (user_id) => {
  //   if (cookies.auth !== "undefined") {
  //     return cookies?.auth?.userId === user_id;
  //   }
  //   return false;
  // };

  const getFavorites = async () => {
    const result = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/api/favorites/${
        loggedInUser.userId
      }`
    );
    const data = await result.json();
    if (result.status === 200) setFavorites(data.data);
  };

  useEffect(() => {
    getFavorites();
  }, [cookies, loggedInUser]);

  const getRecipe = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/recipes/${slug}`
      );
      const data = await response.json();
      if (data.status === 200) {
        setRecipe(data.data);
      } else {
        Swal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  const addToFavorites = async () => {
    const requestData = {
      userId: cookies.auth.userId,
      recipeId: recipe.recipeId,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/favorites/addFavorite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Recipe added to favorites!",
          text: "The recipe has been added to your favorites.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        setFavorites((prevFavorites) => [
          ...prevFavorites,
          { recipeId: recipe.recipeId },
        ]);
      } else {
        Swal.fire({
          title: "Error",
          text: responseData.message || "Something went wrong!",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  const removeFromFavorites = async (id) => {
    // console.log("RECIPE ======= ", { id, recipe: recipe.recipeId });
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/api/favorites/deleteFavorite/${id}`,
        {
          method: "DELETE",
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Recipe deleted from favorites!",
          text: "The recipe has been deleted from your favorites.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        setFavorites((prevFavorites) =>
          prevFavorites.filter(
            (favorite) => favorite.recipeId !== recipe.recipeId
          )
        );
      } else {
        Swal.fire({
          title: "Error",
          text: responseData.message || "Something went wrong!",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
    navigate(location.pathname);
  };

  const deleteRecipe = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/recipes/deleteRecipe/${slug}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.status === 200) {
        Swal.fire({
          title: "Recipe deleted successfully!",
          text: "The recipe has been deleted.",
          icon: "success",
          confirmButtonText: "Okay",
        }).then(() => {
          navigate(-1);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          confirmButtonText: "Okay",
        });
        navigate("/recipes");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Okay",
      });
      navigate("/recipes");
    }
  };

  useEffect(() => {
    getRecipe();
  }, [slug]);

  // useEffect(() => {
  //   setIsUserLoggedIn(checkUserExist());
  //   if (recipe) {
  //     setIsSameUser(checkSameUser(recipe.userId));
  //   }
  // }, [cookies, recipe]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const favoriteRecipe = favorites.find(
    (favorite) => favorite.recipeId === recipe.recipeId
  );

  console.log({ favoriteRecipe });

  return (
    <SectionWrapper>
      <div className="shadow p-5 recipe-detail-container">
        <h1 className="recipe-title">{recipe.name}</h1>
        <img className="recipe-image" src={recipe.image} alt={recipe.name} />
        {isUserLoggedIn && (
          <button
            className="btn btn-primary"
            style={{ background: favoriteRecipe && "red" }}
            onClick={() =>
              favoriteRecipe
                ? removeFromFavorites(favoriteRecipe.favoritesId)
                : addToFavorites()
            }
          >
            {favoriteRecipe ? "Remove from favorite" : "Add to favorites"}
          </button>
        )}
        <div className="recipe-section">
          <h2 className="section-title">Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
        <div className="recipe-section">
          <h2 className="section-title">Steps</h2>
          <ol className="steps-list">
            {recipe.steps.map((step, index) => (
              <li key={index} className="step-item">
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="recipe-section">
          <h2 className="section-title">Notes</h2>
          <p className="recipe-notes">{recipe.notes}</p>
        </div>
        <div className="recipe-section">
          <h2 className="section-title">Tags</h2>
          <div className="tags-container">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="tag-item">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="action-buttons">
          {isUserLoggedIn &&
            (userHasAReview ? (
              <></>
            ) : (
              <Link
                to={`/review/addReview/${recipe.recipeId}`}
                className="action-button"
              >
                Add Review
              </Link>
            ))}
          {checkIsSameUser(loggedInUser && loggedInUser.userId) && (
            <>
              <Link
                to={`/recipes/editRecipesForm/${recipe.recipeId}`}
                className="action-button"
              >
                Edit Recipe
              </Link>
              <button
                onClick={deleteRecipe}
                className="action-button delete-button"
              >
                Delete Recipe
              </button>
            </>
          )}
        </div>
        <Review id={Number(slug)} setUserHasAReview={setUserHasAReview} />
      </div>
    </SectionWrapper>
  );
};

export default RecipeDetail;
