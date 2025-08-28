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

// Add a function to check for reminders
const checkReminders = (notes) => {
    notes.forEach(note => {
        if (note.reminderTime) {
            const reminder = new Date(note.reminderTime);
            const now = new Date();

            if (now.getTime() >= reminder.getTime() && !note.reminded) {
                // If the reminder time has passed, trigger the alert
                alert(`Reminder for: ${note.title}\n\n${note.content}`);

                // Play an alarm sound (optional)
                const audio = new Audio('data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAZGF0YQAAAAAA');
                audio.play();

                // You would need to update the note in the backend to mark it as reminded
                // You can add a new field to your note model, e.g., 'reminded: Boolean'
                // axiosInstance.put(`/update-note-reminded/${note._id}`, { reminded: true });
            }
        }
    });
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
        } catch {
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
        } catch {
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

    // handle clear search
    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    }

    // Use useEffect to check for reminders every minute
    useEffect(() => {
        const interval = setInterval(() => {
            if (allNotes.length > 0) {
                checkReminders(allNotes);
            }
        }, 60000); // Check every 60 seconds

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, [allNotes]); // Rerun when notes change


    useEffect(() => {
        getAllNotes();
        getUserInfo();
        return () => {};
    }, []);

    return (
        <>
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

            <div className="container mx-auto">
                {allNotes.length>0 ? (
                <div className="grid grid-cols-3 gap-4 mt-8">
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

            <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10" 
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
                    className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
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
