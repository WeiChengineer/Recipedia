import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";

const Review = ({ id ,recipeName }) => {

    const [reviews, setReviews] = useState([]);

    const getReviews = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/reviews?recipe_id=${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('reviews=====>', data);
            setReviews(data);
        } catch (error) {
            console.log('error in fetching reviews=====>', error);
        }
    };

    const deleteReview = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/reviews?recipe_id=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Review deleted successfully');
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getReviews(id)
    }, [id]);

    return (
        <div className='mt-4'>
            <h1 className='text-center text-3xl text-gray-800 font-bold'>All Reviwes are here</h1>

            {
                reviews.map((review, index) => (
                    <div key={index} className="flex flex-col gap-4 bg-slate-100 p-4 my-3 rounded-2xl">
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <span className='font-bold text-xl'>{recipeName}</span>
                            </div>
                            <StarRatings
                                rating={review.rating}
                                starDimension="40px"
                                starSpacing="15px"
                            />
                        </div>
                        <div>
                            {review.content}
                        </div>
                        <div className="flex justify-between">
                            <span>{new Date(review.date).toLocaleString()}</span>
                            <div className='flex gap-4'>
                                <Link to={`/review/updateReview/${review.id}`} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 '>Edit</Link>
                                <button onClick={() => deleteReview(review.id)} className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 '>Delete</button>

                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Review
