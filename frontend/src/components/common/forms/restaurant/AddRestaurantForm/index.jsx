import { useEffect, useState } from 'react';
import Select from 'react-select';
import SectionWrapper from "../../../SectionWrapper"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { uploadImageHandler } from '../../../../utils/FirebaseImageUpload/uploadImage';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  cuisineType: z.string().min(1, 'Cuisine Id is required'),
  rating: z.number().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  notes: z.string().min(1, 'Notes are required'),
  image: z.string().min(1, 'Image are required'),
});

const defaultValues = {
  name: "",
  location: "",
  cuisineType: "", 
  rating: 5,
  notes: "",
  image: "",
};

const AddRestaurantForm = () => {
  const navigate = useNavigate();
  
  const [cuisines, setCuisines] = useState([]);
  
  const { register, handleSubmit, setValue, formState: { errors,setError } } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    
    fetch('http://localhost:3000/categories')
      .then(response => response.json())
      .then(data => {
        
        const formattedCuisines = data.map(cuisine => ({
          value: cuisine.id,
          label: cuisine.name
        }));

        setCuisines(formattedCuisines);
      })
      .catch(error => console.error('Error fetching cuisines:', error));
  
    }, []);
    
  const addNewRestaurant = async (data) =>{
    try {
      const response = await fetch('http://localhost:3000/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if(result.status === 200){
        // Swal.fire({
        //   title: 'Success',
        //   text: 'Restaurant added successfully!',
        //   icon:'success',
        //   confirmButtonText: 'Okay'
        // });
        Swal.fire({
          title: 'Error',
          text: 'Failed to add new restaurant. Please try again.',
          icon:'error',
          confirmButtonText: 'Okay'
        });
        navigate('/restaurant');
      }
      else{
        Swal.fire({
          title: 'Success',
          text: 'Restaurant added successfully!',
          icon:'success',
          confirmButtonText: 'Okay'
        });
        navigate('/restaurant');
        // Swal.fire({
        //   title: 'Error',
        //   text: 'Failed to add new restaurant. Please try again.',
        //   icon:'error',
        //   confirmButtonText: 'Okay'
        // });
      }
      
    } catch (error) {
      
      Swal.fire({
        title: 'Error',
        text: 'Failed to add new restaurant due to server error. Please try again.',
        icon:'error',
        confirmButtonText: 'Okay'
      });

    }
  }

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

    console.log("object",imageUrl)
    setValue('image', imageUrl);
  }


  const onSubmit = (data) => {

    console.log(data);
    addNewRestaurant(data);
  };

  const handleCuisineChange = (selectedOption) => {
    setValue('cuisineType', selectedOption.value);
  };

  return (
    <SectionWrapper>
      <form className="rounded-3xl shadow-2xl p-4" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-lg sm:text-2xl md:text-5xl text-center">
          Add New Restaurant
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            {...register('location')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cuisine Type</label>
          <Select
            options={cuisines}
            onChange={handleCuisineChange}
            className="mt-1 block w-full"
          />
          {errors.cuisineType && <p className="text-red-500 text-xs mt-1">{errors.cuisineType.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <input
            type="number"
            max={5}
            min={1}
            step={0.1}
            {...register('rating', { valueAsNumber: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            {...register('notes')}
            rows={4}
            className="mt-1 block resize-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Restaurant Image</label>
          <input 
            type="file"
            onChange={imageHandler}
            accept="image/*"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </div>
      </form>
    </SectionWrapper>
  );
};

export default AddRestaurantForm;
