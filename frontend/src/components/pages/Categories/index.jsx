import SectionWrapper from "../../common/SectionWrapper"
import { Link } from "react-router-dom"

import Search from "./Search"
import CountryFlag from "./CountryFlag"
import { useEffect, useState } from "react"
import CuisineDetail from "./CuisineDetail"
const Categories = () => {

  const [cusines, setCuisines] = useState([]);

  const fetchCusines = async () => {
    const response = await fetch('http://localhost:3000/categories');
    const data = await response.json();
    setCuisines(data);
    console.log("object", data);
  }

  console.log(cusines)
  useEffect(() => {
    fetchCusines();
  }, [])

  return (
    <SectionWrapper>
      <h1 className="text-lg sm:text-2xl md:text-5xl text-center">
        Cuisine
      </h1>
      <div className=" flex justify-end md:-mt-9">
        <Link to="/cuisine/cuisineForm" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Add Cuisine</Link>
      </div>
      <Search />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-3 bg-slate-50">
        {
          cusines.map(cuisine => (
            <div key={cuisine.id} className="w-full my-4 flex flex-col border-2 gap-3 border-slate-100 p-4">
              <CountryFlag countryCode={cuisine.country.value} title={cuisine.country.label} />
              <h1>Cuisine : {cuisine.name}</h1>
              <p>Country: {cuisine.country.label} </p>
              <Link to={`/cuisine/cuisineDetail/${cuisine.id}`} className="self-end px-3 text-sm mt-5 py-1 rounded-full text-white bg-blue-600 focus:bg-blue-700">Detail</Link>
            </div>
          ))
        }
      </div>
    </SectionWrapper>
  )
}

export default Categories