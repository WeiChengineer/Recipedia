import SectionWrapper from "../../SectionWrapper"
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  country: z.object({
    value: z.string().min(1, { message: 'Please select a value' }),
    label: z.string().min(1, { message: 'Please select a label' })
  }).refine(data => data.value && data.label, { message: 'Please select an option' })
});


const CuisineForm = () => {

  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const dataSubmitted = async (data) => {
    
    // const response = await fetch('/api/cuisines', {
    const response = await fetch('http://localhost:3000/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    
    console.log(result)

    if (result.status === 200) {
      alert('Cuisine added successfully!')
      navigate('/categories')
    } else {
      alert('Failed to add cuisine. Please try again.')
      navigate('/categories')
    } 
  }

  const onSubmit = (data) => {
    console.log(data);
    dataSubmitted(data)
  };
  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = value => {
    setValue("country", value, { shouldValidate: true });
  }

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
  )
}

export default CuisineForm
