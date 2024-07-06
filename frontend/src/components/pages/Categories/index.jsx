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
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-6 mt-3 bg-slate-50">
        {
          cusines.map(cuisine => (
            <CountryFlag key={cuisine.id} slug={cuisine.id} countryCode={cuisine.country.value} title={cuisine.country.label} />
          ))
        }
      </div>
      {/* <CuisineDetail/> */}
    </SectionWrapper>
  )
}

export default Categories