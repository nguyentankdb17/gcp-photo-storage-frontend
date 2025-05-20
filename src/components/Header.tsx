import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { auth } from "../config/firebase";
import { useAuth } from "../context/UserContext";
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
                            <button
                                onClick={() => setNavbarOpen(!navbarOpen)}
                                className={`ring-primary absolute top-1/2 right-4 block -translate-y-1/2 rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden ${
                                    navbarOpen ? "navbarTogglerActive" : ""
                                }`}
                                id="navbarToggler"
                            >
                                <span className="bg-body-color relative my-[6px] block h-[2px] w-[30px] dark:bg-white"></span>
                                <span className="bg-body-color relative my-[6px] block h-[2px] w-[30px] dark:bg-white"></span>
                                <span className="bg-body-color relative my-[6px] block h-[2px] w-[30px] dark:bg-white"></span>
                            </button>
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
                                        <a
                                            href="#"
                                            className="text-body-color hover:text-dark flex py-2 text-base font-medium lg:ml-12 lg:inline-flex dark:text-gray-500 dark:hover:text-white"
                                        >
                                            Features
                                        </a>
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
                                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
                                <Link to="/login">
                                    <a
                                        href="#"
                                        className="bg-blue-700 px-7 py-3 text-base font-medium text-gray-700 hover:text-gray-500 dark:text-white"
                                    >
                                        Login
                                    </a>
                                </Link>
                                <a
                                    href="#"
                                    className="rounded-md bg-blue-700 px-7 py-3 text-base font-medium text-white hover:bg-blue-900"
                                >
                                    Sign Up
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
