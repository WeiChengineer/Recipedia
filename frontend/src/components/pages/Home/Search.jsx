import { useState, useEffect } from "react";
import Select from "react-select";
import SectionWrapper from "../../common/SectionWrapper";
import '../../css/common.css';
import '../../css/search.css'

const Search = () => {
    const [recipes, setRecipes] = useState([]);
    const [cuisine, setCuisine] = useState([]);
    const [isSearch, setIsSearch] = useState(false);

    const getRecipes = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/recipes');
            const data = await response.json();
            if (data.status === 200) {
                setRecipes(data.data.map(r => ({ value: r.recipeid, label: r.name })));
                console.log("recipes", recipes)
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const getCuisine = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/cuisines');
            const data = await response.json();
            if (data.status === 200) {
                setCuisine(data.data.map(c => ({ value: c.cuisineid, label: c.name })));
                console.log("cuisine", cuisine)
            }
        } catch (error) {
            console.error('Error fetching cuisines:', error);
        }
    };

    const handleCuisineChange = (selectedOption) => {
        console.log("object changed", selectedOption);
    };

    const searchItems = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/searchAndFilter", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const data = await response.json();
            if (data.status === 200) {
                console.log("search result", data.data)
            }
        } catch (error) {
            console.error('Error searching:', error);
        }

    }
    useEffect(() => {
        getRecipes();
        getCuisine();
    }, []);

    return (
        <SectionWrapper>

            <form className="mt-2">
                <div className="search-bar">
                    <input
                        type="search"
                        id="default-search"
                        className="search-input"
                        placeholder="Search recipes by name, restaurant, or ingredients"
                        required=""
                        onFocus={() => setIsSearch(true)}
                    />

                    <button className="btn btn-primary"
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsSearch(false);
                            searchItems();
                            console.log(" is not search");
                        }}
                    >
                        Search
                    </button>

                </div>

                {isSearch && (
                    <div className="grid grid-sm-2">
                        <div className="mb-4">
                            <h1>Select Category</h1>
                            <Select
                                options={cuisine}
                                onChange={handleCuisineChange}
                            // className="mt-1 block w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <h1>Select recipe</h1>
                            <Select
                                options={recipes}
                                onChange={handleCuisineChange}
                            // className="mt-1 block w-full"
                            />
                        </div>
                    </div>
                )}
            </form>
        </SectionWrapper>

    );
};

export default Search;