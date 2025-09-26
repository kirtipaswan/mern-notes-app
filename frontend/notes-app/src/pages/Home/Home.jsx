import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from "../../assets/images/add-note.png";
import NoDataImg from "../../assets/images/no-data.png";

// Function to play a subtle beep sound
const playSubtleBeep = () => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine'; // A clean, simple tone
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Volume (0.0 to 1.0)

        oscillator.start();
        // Stop the sound after a very short duration
        oscillator.stop(audioContext.currentTime + 0.2); // 0.2 seconds
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2); // Fade out
    } catch (e) {
        console.error("Web Audio API not supported or error playing sound:", e);
        // Fallback for browsers that don't support Web Audio API
        // This is a very short, almost silent WAV data URI
        const fallbackAudio = new Audio('data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAZGF0YQAAAAAA');
        fallbackAudio.play();
    }
};


const Home = () => {

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "ADD",
        data: null,
    });

    const [showToastMsg, setShowToastMessage] = useState({
        isShown: false,
        message: "",
        type: "ADD"
    });

    const [allNotes, setAllNotes] = useState([]);
    const [userInfo, setUserInfo] = useState(null);

    const [isSearch, setIsSearch] = useState(false);

    const navigate = useNavigate();
    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({
            isShown: true,
            type: "EDIT",
            data: noteDetails,
        });
    };

    const showToastMessage = (message, type) => {
        setShowToastMessage({
            isShown: true,
            message: message,
            type: type,
        });
    }

    const handleCloseToast = () => {
        setShowToastMessage({
            isShown: false,
            message: "",
        });
    }

    // get user info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user)
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    // get all notes
    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get("/get-all-notes");
            if (response.data && response.data.notes) {
                setAllNotes(response.data.notes);
            }
        } catch (error) {
            console.log("An unexpected error occurred. Please try again later.");
        }
    };

    // delete note
    const deleteNote = async (data) => {
        const noteId = data._id;
        try {
            const response = await axiosInstance.delete("/delete-note/" + noteId);

            if (response.data && !response.data.error) {
                showToastMessage("Note Deleted Successfully", "DELETE");
                getAllNotes();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.log("An unexpected error occurred. Please try again later.");
            }
        }
    }

    // search note
    const onSearchNote = async (searchQuery) => {
        try {
            const response = await axiosInstance.get("/search-notes", {
                params: {
                    query: searchQuery,
                },
            });

            if (response.data && response.data.notes) {
                setIsSearch(true);
                setAllNotes(response.data.notes);
            }
        } catch (error) {
            console.log("An unexpected error occurred. Please try again later.");
        }
    }

    // update pinned status
    const updateIsPinned = async (noteData) => {
        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
                isPinned: !noteData.isPinned
            });

            if (response.data && response.data.note) {
                showToastMessage("Note Updated Successfully");
                getAllNotes();
            }
        } catch(error) {
            console.log("An unexpected error occurred. Please try again later.");
            }
    }

    // NEW FUNCTION: Update the 'reminded' status in the backend
    const updateRemindedStatus = async (noteId) => {
        try {
            await axiosInstance.put(`/update-note-reminded/${noteId}`, { reminded: true });
            // After updating backend, refresh notes to get the latest status
            getAllNotes();
        } catch (error) {
            console.error("Error updating reminded status:", error);
        }
    };

    // Use useEffect to check for reminders every minute
    useEffect(() => {
        const interval = setInterval(() => {
            if (allNotes.length > 0) {
                const now = new Date();
                allNotes.forEach(note => {
                    if (note.reminderTime) {
                        const reminder = new Date(note.reminderTime);

                        // Only trigger if reminder time has passed and it hasn't been reminded yet
                        if (now.getTime() >= reminder.getTime() && !note.reminded) {
                            alert(`Reminder for: ${note.title}\n\n${note.content}`);
                            
                            // Play the subtle beep sound
                            playSubtleBeep();

                            // Call the new function to update the backend
                            updateRemindedStatus(note._id);
                        }
                    }
                });
            }
        }, 60000); // Check every 60 seconds

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, [allNotes]); // Rerun when notes change

    // handle clear search
    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    }

    useEffect(() => {
        getAllNotes();
        getUserInfo();
        return () => {};
    }, []);

    return (
        <>
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

            <div className="container mx-auto pt-4">
                {allNotes.length>0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"> {/* Adjusted for better responsiveness and scroll space */}
                    {allNotes.map((item, index) => (
                        <NoteCard 
                        key={item._id}
                        title={item.title} 
                        date={item.createdOn} 
                        content={item.content}
                        tags={item.tags}
                        isPinned={item.isPinned}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => deleteNote(item)}
                        onPinNote={() => updateIsPinned(item)}
                        />
                    ))}
                </div>) : (
                    <EmptyCard imgSrc={isSearch ? NoDataImg : AddNotesImg} message={isSearch ? "Oops! No notes found matching your search." : "Start creating your first note! Click 'Add' button  to jot down your thoughts, ideas, and reminders. Let's get started!"} />

                )}
            </div>

            {/* Positioned the Add button to be fixed at the bottom right */}
            <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-4 bottom-4 md:right-10 md:bottom-10 z-50 shadow-lg" 
                    onClick={() => {
                        setOpenAddEditModal({
                            isShown: true,
                            type: "ADD",
                            data: null,
                        });
                    }}>
                <MdAdd className="text-white text-[32px]" />
            </button>

            <Modal 
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => {}}
                style={
                    {
                        overlay: {
                            backgroundColor: "rgba(0, 0, 0, 0.2)",
                        },
                    }}
                    contentLabel=""
                    // Adjusted modal class for better responsiveness and added overflow-y-auto for scrolling
                    className="w-[90%] md:w-[40%] max-h-[90vh] bg-white rounded-md mx-auto p-14 mt-8 overflow-y-auto"
                    >

                    <AddEditNotes
                        type={openAddEditModal.type}
                        noteData={openAddEditModal.data}
                        className="" 
                        onclose={() => {
                            setOpenAddEditModal({
                                isShown: false,
                                type: "ADD",
                                data: null,
                            });
                        }}
                        getAllNotes={getAllNotes}
                        showToastMessage={showToastMessage}
                    />
            </Modal>


            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </>
    );
};

export default Home;

