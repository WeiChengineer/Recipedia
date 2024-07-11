import { useState, useEffect } from "react";
import Select from "react-select";

const Search = () => {
    const [recipes, setRecipes] = useState([]);
    const [cuisine, setCuisine] = useState([]);
    const [isSearch, setIsSearch] = useState(false);

    const getRecipes = async () => {
        try {
            const response = await fetch('http://localhost:3000/recipes');
            const data = await response.json();
            setRecipes(data.map(r => ({ value: r.id, label: r.name })));
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const getCuisine = async () => {
        try {
            const response = await fetch('http://localhost:3000/categories');
            const data = await response.json();
            setCuisine(data.map(c => ({ value: c.id, label: c.name })));
        } catch (error) {
            console.error('Error fetching cuisines:', error);
        }
    };

    const handleCuisineChange = (selectedOption) => {
        console.log("object changed", selectedOption);
    };

    useEffect(() => {
        getRecipes();
        getCuisine();
    }, []);

    return (
        <form className="max-w-full mx-auto mt-2">
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-800"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border-gray-300 rounded-lg outline-none bg-gray-50 border-2 focus:border-blue-500"
                    placeholder="Search Food..."
                    autoComplete="off"
                    required=""
                    onFocus={() => {
                        setIsSearch(true);
                        console.log(" is search");
                    }}
                />
                <button
                    type="submit"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsSearch(false);
                        console.log(" is not search");
                    }}
                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                    Search
                </button>
            </div>

            {isSearch && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                    <div className="mb-4">
                        <Select
                            options={cuisine}
                            onChange={handleCuisineChange}
                            className="mt-1 block w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <Select
                            options={recipes}
                            onChange={handleCuisineChange}
                            className="mt-1 block w-full"
                        />
                    </div>
                </div>
            )}
        </form>
    );
};

export default Search;
