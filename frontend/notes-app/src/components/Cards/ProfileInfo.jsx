import { MdLogout } from "react-icons/md";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
    return (
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
                {getInitials(userInfo?.fullName)}
            </div>

            <div>
                <p className="text-sm font-medium">{userInfo?.fullName}</p>
            </div>

            <button
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4B5563",
                    transition: "background 0.2s, color 0.2s",
                    pointerEvents: "all",       
                    position: "relative",
                    zIndex: 999,               
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = "#ef4444";
                    e.currentTarget.style.color = "white";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#4B5563";
                }}
                onClick={onLogout}
                title="Logout"
            >
                <MdLogout style={{ pointerEvents: "none" }} size={20} />
            </button>
        </div>
    );
}

export default ProfileInfo;