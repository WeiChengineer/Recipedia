import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {  useNavigate, useParams } from 'react-router-dom';
import SectionWrapper from '../../../SectionWrapper';

const reviewSchema = z.object({
    content: z.string().min(1, 'Content is required'),
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    user_id: z.string(), 
    recipe_id: z.string(), 
    date: z.string()
});

const EditReviewForm = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [existingReview, setExistingReview] = useState(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(reviewSchema)
    });

    useEffect(() => {

        const fetchReview = async () => {
            try {
                const response = await fetch(`http://localhost:3000/reviews/${slug}`);
                if (response.ok) {
                    const reviewData = await response.json();
                    setExistingReview(reviewData);

                    setValue('content', reviewData.content);
                    setValue('rating', reviewData.rating);
                    setValue('user_id', reviewData.user_id);
                    setValue('recipe_id', reviewData.recipe_id);
                    setValue('date', reviewData.date);
                } else {
                    console.error('Failed to fetch review');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchReview();
    }, [slug, setValue]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`http://localhost:3000/reviews/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Review updated successfully');
                navigate(-1);
            } else {
                console.error('Failed to update review');
            }
            const result = await response.json();
            console.log("review updated successfully", result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (!existingReview) {
        return <p>Loading review...</p>; // Optional: Add loading indicator
    }

    return (
        <SectionWrapper>
            <div className="mt-10 p-5 border border-gray-200 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-5">Edit Review</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                        <input
                            type="number"
                            step={0.1}
                            id="rating"
                            {...register('rating', { valueAsNumber: true, setValueAs: (value) => parseFloat(value) })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.rating && <span className="text-red-500 text-sm">{errors.rating.message}</span>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            id="content"
                            rows={4}
                            {...register('content')}
                            className="mt-1 resize-none block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
                    </div>

                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Update Review</button>
                </form>
            </div>
        </SectionWrapper>
    );
};

export default EditReviewForm;
