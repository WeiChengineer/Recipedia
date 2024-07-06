import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const pathname = location.pathname.replace(/^\//, '');

    const paths = ["home", "restaurant", "recipes", "favorites", "categories"];
    useEffect(() => {
        paths.forEach(path => {
            const element = document.getElementById(path);
            if (element) {
                element.style.color = path === pathname ? "#057dcd" : "white";
            }
        });

    }, [pathname, paths]);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="bg-gray-800 sticky top-0 w-full z-50">
                <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link id='home-link' to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                            Recipedia
                        </span>
                    </Link>
                    <button
                        data-collapse-toggle="navbar-default"
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col justify-center items-center p-4 md:p-0 text-white mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                            {paths.map(path => (
                                <li key={path}>
                                    <Link
                                        id={path}
                                        to={`/${path}`}
                                        className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0 md:hover:text-blue-700"
                                        aria-current={pathname === path ? "page" : undefined}
                                    >
                                        {path.charAt(0).toUpperCase() + path.slice(1)}
                                    </Link>
                                </li>
                            ))}

                            <li>
                            <Link
                                        id="signup"
                                        to="/auth/login"
                                        className="block py-2 px-3 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm "
                                        aria-current={pathname === "auth/login" ? "page" : undefined}
                                    >
                                        Login
                                    </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div
                id="drawer-disable-body-scrolling"
                className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto md:hidden bg-gray-800 w-64 ${isOpen ? 'block' : 'hidden'}`}
                tabIndex={-1}
                aria-labelledby="drawer-disable-body-scrolling-label"
            >
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">

                    <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
                        ZACODERS
                    </span>
                </Link>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    data-drawer-hide="drawer-disable-body-scrolling"
                    aria-controls="drawer-disable-body-scrolling"
                    className="bg-transparent text-white hover:bg-gray-200 hover:text-gray-50 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center"
                >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close menu</span>
                </button>
                <div className="py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {paths.map(path => (
                            <li key={path} onClick={() => setIsOpen(false)}>
                                <Link
                                    id={path}
                                    to={`/${path}`}
                                    className="flex items-center p-2 text-gray-50 rounded-lg group"
                                    aria-current={pathname === path ? "page" : undefined}
                                >
                                    {path.charAt(0).toUpperCase() + path.slice(1)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;
