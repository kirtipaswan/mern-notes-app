import React, { useState } from "react";  // Added useState import
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom"; // Added Link import
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
    const [name, setName] = useState(""); // Name state
    const [email, setEmail] = useState(""); // Email state
    const [password, setPassword] = useState(""); // Password state
    const [error, setError] = useState(null); // Error state

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Basic email validation (you can improve it):
        if (!email || !name || !password) {
            setError("All fields are required.");
            return;
        }

        if(!name) {
            setError("Please enter your name.");
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
        // API request or other signUp logic
        // signUp api call
        try {
            const response = await axiosInstance.post("/create-account", {
                fullName: name,
                email : email,
                password : password,
            });

            // handle successful registration response
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
            <Navbar/>

            <div className="flex items-center justify-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleSignUp}> {/* Changed handleLogin to handleSignUp */}
                        <h4 className="text-2xl mb-7">Sign Up</h4>

                        {/* Name input */}
                        <input 
                            type="text" 
                            placeholder="Name" 
                            className="input-box" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                        />

                        {/* Email input */}
                        <input 
                            type="text" 
                            placeholder="Email" 
                            className="input-box" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Password input */}
                        <PasswordInput  
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Display error message */}
                        {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

                        {/* Submit button */}
                        <button type="submit" className="btn-primary">
                            Sign Up
                        </button>

                        <p className="text-sm text-center mt-4">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-primary underline">
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
