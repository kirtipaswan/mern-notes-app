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
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow shadow-md">
            <h2 className="text-xl font-medium text-black py-2">Notes</h2>

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
