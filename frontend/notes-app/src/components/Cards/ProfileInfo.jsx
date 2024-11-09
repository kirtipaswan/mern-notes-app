import React from "react";
import { getInitials } from "../../utils/helper";
import { MdLogout } from "react-icons/md"; // Import the logout icon

const ProfileInfo = ({ userInfo, onLogout }) => {
    return (
        <div className="flex items-center gap-3 ">
            <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
                {getInitials(userInfo?.fullName)}
            </div>
            
            <div>
                <p className="text-sm font-medium">{userInfo?.fullName}</p>
            </div>
            
            <div 
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-800 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-500 hover:text-white"
                onClick={onLogout}
            >
                <MdLogout className="text-lg" />
            </div>
        </div>
    );
}

export default ProfileInfo;
