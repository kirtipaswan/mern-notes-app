import React, { useState } from "react";  
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!name) {
            setError("Please enter your name.");
            return;
        }

        if (!email) {
            setError("Please enter an email address.");
            return;
        }
        
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Please enter a password.");
            return;
        }

        setError(null);
        
        try {
            const response = await axiosInstance.post("/create-account", {
                fullName: name,
                email : email,
                password : password,
            });

            if(response.data && response.data.error) {
                setError(response.data.message);
                return;
            }

            if(response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <> 
            {/* The Navbar will appear on signup page, if desired, otherwise remove */}
            {/* <Navbar/> */}

            {/* Main container for the signup page, using a light background color and centering content */}
            <div className="flex items-center justify-center min-h-screen bg-background-light p-4">
                {/* Form container: card-like appearance with shadow, rounded corners, and fade-in animation */}
                <div className="w-full md:w-96 border border-gray-200 rounded-xl bg-white px-7 py-10 shadow-lg animate-fadeIn">
                    <form onSubmit={handleSignUp}>
                        <h4 className="text-3xl font-bold text-center mb-8 text-primary">Sign Up</h4>

                        {/* Name Input */}
                        <input 
                            type="text" 
                            placeholder="Name" 
                            // Custom input-box styling for better focus feedback
                            className="input-box w-full text-sm bg-gray-50 border-2 border-gray-200 px-5 py-3 rounded-md mb-4 outline-none focus:border-primary transition-colors duration-200" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                        />

                        {/* Email Input */}
                        <input 
                            type="text" 
                            placeholder="Email" 
                            // Custom input-box styling for better focus feedback
                            className="input-box w-full text-sm bg-gray-50 border-2 border-gray-200 px-5 py-3 rounded-md mb-4 outline-none focus:border-primary transition-colors duration-200" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Password Input (assuming PasswordInput component has its own internal styling) */}
                        <PasswordInput  
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <p className="text-red-500 text-xs pb-1 text-center mt-2">{error}</p>}

                        {/* Sign Up Button: using custom primary color with hover effect */}
                        <button type="submit" 
                                className="w-full bg-primary text-white p-3 rounded-md my-4 hover:bg-primary-dark transition-colors duration-200">
                            Sign Up
                        </button>

                        {/* Link to Login Page */}
                        <p className="text-sm text-center mt-4 text-slate-600">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-primary underline hover:text-primary-dark transition-colors duration-200">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );

};

export default SignUp;
