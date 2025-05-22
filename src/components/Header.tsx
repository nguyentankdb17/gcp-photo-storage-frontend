import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuth } from "../context/UserContext";
import logo from "/logo.svg";
const Header: React.FC = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const { user } = useAuth();
    return (
        <header className="flex w-full items-center bg-white dark:bg-[#0F172A]">
            <div className="container mx-auto">
                <div className="relative -mx-4 flex items-center justify-between">
                    <div className="w-60 max-w-full px-4">
                        <Link to="/" className="block w-full py-5">
                            <img src={logo} alt="Logo" className="rounded-2xl" />
                        </Link>
                    </div>
                    <div className="flex w-full items-center justify-between px-4">
                        <div>
                            <nav
                                id="navbarCollapse"
                                className={`${
                                    !navbarOpen ? "hidden" : ""
                                } dark:bg-dark-2 absolute top-full right-4 w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none lg:dark:bg-transparent`}
                            >
                                <ul className="block lg:flex">
                                    <li>
                                        <Link
                                            to="/"
                                            className="text-body-color hover:text-dark flex py-2 text-base font-medium lg:ml-12 lg:inline-flex dark:text-gray-500 dark:hover:text-white"
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/collections"
                                            className="text-body-color hover:text-dark flex py-2 text-base font-medium lg:ml-12 lg:inline-flex dark:text-gray-500 dark:hover:text-white"
                                        >
                                            Your Collections
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-white">👤 {user.displayName || user.email}</span>
                                <button
                                    onClick={() => signOut(auth)}
                                    className="cursor-pointer rounded-md bg-red-700 px-3 py-2 text-base font-medium text-white hover:bg-red-900"
                                >
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
                                <Link
                                    to="/login"
                                    className="rounded-md bg-blue-700 px-7 py-3 text-base font-medium text-white hover:bg-blue-900"
                                >
                                    Login
                                </Link>
                            </div>
                        )}

                        <button
                            onClick={() => setNavbarOpen(!navbarOpen)}
                            className={`ring-primary cursor-pointer rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden ${
                                navbarOpen ? "navbarTogglerActive" : ""
                            }`}
                            id="navbarToggler"
                        >
                            <span className="bg-body-color relative my-[6px] block h-[2px] w-[30px] dark:bg-white"></span>
                            <span className="bg-body-color relative my-[6px] block h-[2px] w-[30px] dark:bg-white"></span>
                            <span className="bg-body-color relative my-[6px] block h-[2px] w-[30px] dark:bg-white"></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
