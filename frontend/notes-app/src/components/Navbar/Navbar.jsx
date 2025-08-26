import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileInfo from '../Cards/ProfileInfo';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const onLogout = () => {
        console.log("Logout clicked");
        localStorage.clear();
        navigate("/login");
    };

    const handleSearch = () => {
        if(searchQuery) {
            onSearchNote(searchQuery);
        }
    };

    const onClearSearch = () => {
        setSearchQuery("");
        handleClearSearch();
    };

    return (
        // Enhanced Navbar styling: using a light background, more shadow, and stickiness
        <div className="bg-white flex items-center justify-between px-6 py-3 drop-shadow-md sticky top-0 z-50">
            {/* Using a custom primary color from tailwind.config.js for the title */}
            <h2 className="text-2xl font-semibold text-primary py-2">NotesApp</h2>

            <SearchBar 
                value={searchQuery}
                onChange={({ target }) => {
                    setSearchQuery(target.value);
                }}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            />

            {/* Only show ProfileInfo if userInfo is available */}
            {userInfo && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
        </div>
    );
};

export default Navbar;

