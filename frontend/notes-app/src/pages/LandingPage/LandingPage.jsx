import React from 'react';
import { Link } from 'react-router-dom';
import NotesImage from '../../assets/images/notes-landing.png'; // Make sure to add an image to your assets folder

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-light p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Your Ideas, Organized.</h1>
        <p className="text-base md:text-lg text-text-muted mb-8 max-w-prose mx-auto">
          Jot down your thoughts, set reminders, and keep track of everything that matters. Simple, powerful, and beautifully designed.
        </p>
        <img src={NotesImage} alt="Notes app illustration" className="w-full h-auto rounded-lg shadow-xl mb-12" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-medium rounded-md shadow-lg hover:bg-primary-dark transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-full sm:w-auto px-6 py-3 text-primary font-medium rounded-md border-2 border-primary hover:bg-primary-light transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;