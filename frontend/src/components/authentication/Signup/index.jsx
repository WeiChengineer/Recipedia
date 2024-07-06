import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { uploadImageHandler } from "../../utils/FirebaseImageUpload/uploadImage"

const schema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  username: z.string().min(4, 'Username is required'),
  password: z.string().min(6, 'Password is required'),
  profileImage: z.string().min(8, 'Profile image is required')
});

const Signup = () => {
  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const imageHandler = async (event) => {
    const image = event.target.files[0]
    const imageUrl = await uploadImageHandler(image)
    
    if (imageUrl === '404 error') {
      setError('profileImage', {  
        type: 'manual',
        message: 'Image upload failed',
      });
      return;
    }

    console.log("object",imageUrl)
    setValue('profileImage', imageUrl);
  }


  const sendata = async (data) => {
    const result = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log("Data sent", result)

  };

  const onSubmit = (data) => {

    console.log('Form submitted:', data);
    sendata(data)
  };

  return (
    <div className='min-h-[calc(100vh-200px)] flex justify-center items-center'>
      <div className="w-full bg-white rounded-lg shadow-2xl text-black md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Sign up for your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                Your email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg outline-none focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="name@company.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                Your Username
              </label>
              <input
                type="text"
                id="username"
                {...register('username')}
                className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg outline-none focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${errors.username ? 'border-red-500' : ''}`}
                placeholder="username"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg outline-none focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="profileImage">
                Profile Image
              </label>
              <input
                type="file"
                id="profileImage"
                onChange={imageHandler}
                accept=".png, .jpg, .jpeg" // Limit file types
                className={`block w-full text-sm p-1 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none  ${errors.profileImage ? 'border-red-500' : ''}`}
              />
              {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Create an account
            </button>
            <p className="text-sm font-light text-gray-800">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;