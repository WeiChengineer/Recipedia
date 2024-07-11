import { useEffect, useState } from "react"


const HomeBody = () => {

    const [recipes, setRecipes] = useState()

    const getRecipes = async () => {
        const response = await fetch('http://localhost:3000/recipes');
        const data = await response.json();
        console.log("data is ==>", data);
        setRecipes(data);
    }
    useEffect(() => {
        getRecipes();
    }, []);
    return (
        <>
            <h1 className="font-bold text-lg">Recipes</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
            {
                recipes && recipes.map((recipe, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <img className="w-full h-52 bg-blue-100 max-w-full rounded-lg"
                            src={recipe.image}
                            alt="gallery-photo" />
                        <h2>{recipe.name}</h2>
                        <p>{recipe.description}</p>
                    </div>
                ))
            }
        </div>
        </>
    )
}

export default HomeBody
