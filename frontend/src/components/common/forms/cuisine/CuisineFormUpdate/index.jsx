import SectionWrapper from "../../../SectionWrapper";
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from "react";
import Swal from "sweetalert2";

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  country: z.object({
    value: z.string().min(1, { message: 'Please select a value' }),
    label: z.string().min(1, { message: 'Please select a label' })
  })
});

const CuisineFormUpdate = () => {
  let { slug } = useParams();

  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const getCuisine = async () => {
    try {
      const response = await fetch(`http://localhost:3000/categories/${slug}`);
      const data = await response.json();
      setValue('name', data.name);
      setValue('description', data.description);
      setValue('country', { value: data.country.value, label: data.country.label });
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getCuisine();
  }, [slug]);

  const updatedData = async (data) => {
    const response = await fetch(`http://localhost:3000/categories/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      Swal.fire({
        title: 'Success',
        text: 'Cuisine updated successfully!',
        icon:'success',
        confirmButtonText: 'Okay'
      });
      navigate('/categories');
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Failed to update cuisine. Please try again.',
        icon: 'error',
        confirmButtonText: 'Okay'
      });
      navigate('/categories');
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    updatedData(data);
  };

  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = value => {
    setValue("country", value, { shouldValidate: true });
  };

  return (
    <SectionWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={6}
            className="mt-1 block resize-none w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
          {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Select Option</label>
          <Select options={options} onChange={changeHandler} />
          {errors.country && <p className="mt-2 text-sm text-red-600">{errors.country.message}</p>}
        </div>

        <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Submit
        </button>
      </form>
    </SectionWrapper>
  );
};

export default CuisineFormUpdate;