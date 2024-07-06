import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CountryFlag from './CountryFlag';
import SectionWrapper from '../../common/SectionWrapper';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

const CuisineDetail = () => {
    const navigate = useNavigate();
    let { slug } = useParams();
    console.log("id=>", slug);

    const [cuisineDetail, setCuisinesDetail] = useState({});

    const deleteCuisine = async () => {
        try {
            const response = await fetch(`http://localhost:3000/categories/${slug}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            console.log("Deleted cuisine===>", result)

            if (result.status === 200)
            {
                Swal.fire({
                    title: 'Cuisine deleted successfully!',
                    text: 'The cuisine has been deleted.',
                    icon:'success',
                    confirmButtonText: 'Okay'
                })
                navigate('/categories');
            }
            else
            {
                Swal.fire({
                    title: 'Cuisine deleted successfully!',
                    text: 'The cuisine has been deleted.',
                    icon:'success',
                    confirmButtonText: 'Okay'
                })
                // Swal.fire({
                //     title: 'Failed to delete cuisine!',
                //     text: 'The cuisine could not be deleted.',
                //     icon:'error',
                //     confirmButtonText: 'Okay'
                // })
                navigate('/categories');
                console.error('Error deleting cuisine:');
            }
        } catch (error) {
            console.error('Error deleting cuisine:', error);
        }
    }

    const getCuisineDetail = async () => {
        try {
            const response = await fetch(`http://localhost:3000/categories/${slug}`);
            const data = await response.json();
            console.log("detail===>", data)
            setCuisinesDetail({ ...data });
            console.log("detailed ===>", cuisineDetail)
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCuisineDetail();
    }, [])


    return (
        <SectionWrapper>
            <div className="w-full  flex flex-col bg-white border border-gray-200 rounded-lg shadow-2xl p-4  hover:bg-gray-100 transition duration-300 ease-in-out">
                <div className='h-80'>
                    {cuisineDetail?.country && (
                        <CountryFlag
                            countryCode={cuisineDetail.country.value}
                            title={cuisineDetail.country.label}
                            slug={`/cuisine/cuisineDetail/${slug}`}
                        />
                    )}
                </div>
                <div className="flex flex-col justify-between p-4 leading-normal">
                    <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{cuisineDetail?.name}</h1>
                    <p className="mb-3 font-normal text-gray-700 indent-10 text-justify">{cuisineDetail?.description}</p>
                </div>
                <div className='flex justify-end'>
                    <Link to={`/cuisine/updateForm/${slug}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Edit Cuisine</Link>
                    <button onClick={deleteCuisine} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Delete Cuisine</button>

                </div>
            </div>
        </SectionWrapper>
    )
}

export default CuisineDetail
