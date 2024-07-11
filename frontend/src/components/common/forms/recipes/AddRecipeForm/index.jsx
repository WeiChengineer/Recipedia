import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SectionWrapper from '../../../SectionWrapper';
import { uploadImageHandler } from '../../../../utils/FirebaseImageUpload/uploadImage';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const recipeSchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    ingredients: z.array(z.string().min(1, "Ingredients are required")),
    steps: z.array(z.string().min(1, "Steps are required")),
    notes: z.string(),
    tags: z.array(z.string().min(1, "Tags are required")),
    image: z.string().min(1, "Image is required"),
    restaurant_id:z.string().min(1,"Restaurant Id is required")
});

const AddRecipeForm = () => {
    const { register, handleSubmit, setError, setValue, getValues, formState: { errors } } = useForm({
        resolver: zodResolver(recipeSchema)
    });
    
    const { slug } = useParams();
    setValue("restaurant_id",slug)

    const [tags, setTags] = useState([]);
    const [steps, setSteps] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const addRecipe = async (recipe) => { 
        try {
            const response = await fetch('http://localhost:3000/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recipe)
            });
            const result = await response.json();
            console.log(result);
            alert('Recipe added successfully!');
        }
        catch (error) {
            console.error('Error adding recipe:', error);
        }
    }

    const handleStepsChange = (steps) => {
        setSteps(steps);
        setValue("steps", steps);
        console.log("steps", getValues("steps"));
    }

    const handleTagsChange = (tags) => {
        setTags(tags);
        setValue("tags", tags);
        console.log("tags", getValues("tags"));
    };

    const handleIngredientsChange = (ingredients) => {
        setIngredients(ingredients);
        setValue("ingredients", ingredients);
        console.log("ingredients", getValues("ingredients"));
    };

    const onSubmit = data => {
        console.log(data);
        addRecipe(data);
    };

    const imageHandler = async (event) => {
        const img = event.target.files[0]
        const imageUrl = await uploadImageHandler(img)

        if (imageUrl === '404 error') {
            setError('image', {
                type: 'manual',
                message: 'Image upload failed',
            });
            return;
        }

        console.log("object", imageUrl)
        setValue('image', imageUrl);
    }

    return (
        <SectionWrapper>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white shadow-md rounded-lg">
                <h1 className='font-bold text-center text-lg md:text-3xl'>Add New Recipe</h1>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input {...register("name")} className="mt-1 p-2 border focus:ring-[#a5d24a] focus:ring-2 focus:border-none outline-none border-gray-300 rounded w-full" />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block py-2 text-gray-700">Ingredients</label>
                    <TagsInput value={ingredients} onChange={handleIngredientsChange} placeholder="Add new Ingredients" />
                    <label className='text-gray-400'>Press enter to add new ingredients</label>
                    {errors.ingredients && <p className="text-red-500">{errors.ingredients.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block py-2 text-gray-700">Steps</label>
                    <TagsInput value={steps} onChange={handleStepsChange} placeholder="Add new Steps" />
                    <label className='text-gray-400'>Press enter to add new steps</label>
                    {errors.steps && <p className="text-red-500">{errors.steps.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Notes</label>
                    <textarea
                        rows={4}
                        {...register("notes")} className="mt-1 p-2 border focus:ring-[#a5d24a] focus:ring-2 focus:border-none outline-none border-gray-300 rounded w-full resize-none" />
                </div>

                <div className="mb-4">
                    <label className="block py-2 text-gray-700">Tags</label>
                    <TagsInput value={tags} onChange={handleTagsChange} placeholder="Add new Tags" />
                    <label className='text-gray-400'>Press enter to add new tags</label>
                    {errors.tags && <p className="text-red-500">{errors.tags.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Image</label>
                    <input type="file" onChange={imageHandler} className="mt-1 p-2 border focus:ring-[#a5d24a] focus:ring-2 focus:border-none outline-none border-gray-300 rounded w-full" />
                    {errors.image && <p className="text-red-500">{errors.image.message}</p>}
                </div>

                <button className="bg-blue-500 text-white p-2 rounded">Submit</button>
            </form>
        </SectionWrapper>
    );
};

export default AddRecipeForm;
