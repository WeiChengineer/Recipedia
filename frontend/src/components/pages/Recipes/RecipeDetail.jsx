import { useEffect, useState } from 'react';
import SectionWrapper from '../../common/SectionWrapper';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Review from '../Review';

const RecipeDetail = () => {
    const navigate = useNavigate();
    let { slug } = useParams();
    console.log('id=>', slug);
    const [recipe, setRecipe] = useState(null);

    const getRecipe = async () => {
        try {
            const response = await fetch(`http://localhost:3000/recipes/${slug}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('recipe details=====>', data);
            setRecipe(data);
        } catch (error) {
            console.log('error in fetching recipe details=====>', error);
        }
    };

    const deleteRecipe = async () => {
        try {
            const response = await fetch(`http://localhost:3000/recipes/${slug}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Recipe deleted successfully');
            navigate('/recipes');
        } catch (error) {
            console.log('Error in deleting recipe=====>', error);
        }
    }

    useEffect(() => {
        getRecipe();
    }, [slug]);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <SectionWrapper>
            <div className="max-w-full p-4 bg-white shadow-2xl rounded-lg">
                <h1 className="text-3xl font-bold text-center mb-4">{recipe.name}</h1>
                <img className="w-full border-white shadow-2xl h-64 object-cover object-center mb-4 rounded" src={recipe.image} alt={recipe.name} />
                <div className="mb-4">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-2">Ingredients</h2>
                    <ul className="list-disc list-inside">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-gray-600 pl-6 text-2xl">{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div className="mb-4">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-2">Steps</h2>
                    <ol className="list-decimal list-inside">
                        {recipe.steps.map((step, index) => (
                            <li key={index} className="text-gray-600 pl-6 text-2xl">{step}</li>
                        ))}
                    </ol>
                </div>
                <div className="mb-4">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-2">Notes</h2>
                    <p className="text-gray-600 indent-6 text-2xl">{recipe.notes}</p>
                </div>
                <div className="mb-4">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-2">Tags</h2>
                    <div className='ml-3 flex flex-wrap gap-3'>
                        {recipe.tags.map((tag, index) => (
                            <span key={index} className="inline-block px-4 py-2 text-lg md:text-2xl bg-blue-200 text-blue-800 rounded-full uppercase font-semibold tracking-wide">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Link to={`/review/addReview/${recipe.id}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5  mb-2">Add Review</Link>
                    <Link to={`/recipes/editRecipesForm/${recipe.id}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5  mb-2">Edit Recipe</Link>
                    <button onClick={deleteRecipe} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2.5  mb-2">Delete Recipe</button>
                </div>
                <Review id={slug} recipeName={recipe.name}/>
            </div>

        </SectionWrapper>
    );
};

export default RecipeDetail;
