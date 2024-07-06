import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';

const schema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(6, 'Password is required'),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);

  };

  return (
    <div className='w-full min-h-[calc(100vh-200px)] flex justify-center items-center'>
      <div className=" bg-white rounded-lg shadow-2xl text-black md:mt-0 max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Sign in to your account
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
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700  focus:ring-4 focus:outline-none outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign in
            </button>
            <p className="text-sm font-light text-gray-800">
              Don’t have an account yet?{' '}
              <Link to="/auth/signup" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;