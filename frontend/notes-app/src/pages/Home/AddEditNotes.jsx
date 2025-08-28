import React, { useState, useEffect } from "react";
import TagInput from "../../components/Input/TagInput"; // Keep your existing TagInput
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment"; // Import moment for date formatting

const AddEditNotes = ({ noteData, type, getAllNotes, onclose, showToastMessage }) => {

    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []); // Keep tags as an array for TagInput
    const [reminderTime, setReminderTime] = useState(
        noteData?.reminderTime ? moment(noteData.reminderTime).format('YYYY-MM-DDTHH:mm') : ""
    ); // State for reminder time
    const [error, setError] = useState(null);

    // Add note
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post("/add-note", {
                title,
                content,
                tags, // Send tags as an array
                reminderTime: reminderTime ? new Date(reminderTime).toISOString() : null, // Send reminderTime
            });

            if (response.data && response.data.note) {
                showToastMessage("Note Added Successfully", "ADD"); // Added type for consistency
                getAllNotes();
                onclose();
            }
        } catch (error) { // Catch the error object
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again."); // Generic error message
            }
        }
    };

    // Edit note
    const editNote = async () => {
        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put("/edit-note/" + noteId, {
                title,
                content,
                tags, // Send tags as an array
                reminderTime: reminderTime ? new Date(reminderTime).toISOString() : null, // Send reminderTime
            });

            if (response.data && response.data.note) {
                showToastMessage("Note Updated Successfully", "EDIT"); // Added type for consistency
                getAllNotes();
                onclose();
            }
        } catch (error) { // Catch the error object
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again."); // Generic error message
            }
        }
    };

    const handleAddNote = () => { // Renamed from handleSubmit for clarity
        if (!title) {
            setError("Please enter a title");
            return;
        }

        if (!content) {
            setError("Please enter content");
            return;
        }

        setError(null); // Clear error if validation passes

        if (type === "EDIT") {
            editNote();
        } else {
            addNewNote();
        }
    };

    // Set initial reminder time if editing an existing note
    useEffect(() => {
        if (noteData?.reminderTime) {
            setReminderTime(moment(noteData.reminderTime).format('YYYY-MM-DDTHH:mm'));
        }
    }, [noteData]);

    return (
        <div className="relative">
            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50" onClick={onclose}>
                <MdClose className="text-xl text-slate-400" />
            </button>

            <div className="flex flex-col gap-2">
                <label className="input-label">TITLE</label>
                <input
                    type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Go to the gym at 6 PM"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">CONTENT</label>
                <textarea
                    type="text"
                    className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded resize-none" // Added resize-none
                    placeholder="Content"
                    rows={10}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                ></textarea>
            </div>

            <div className="mt-3">
                <label className="input-label">TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {/* New Reminder Time Input */}
            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">REMINDER TIME (Optional)</label>
                <input
                    type="datetime-local"
                    className="input-box" // Using your existing input-box class
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                />
            </div>

            {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

            <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddNote}>
                {type === 'EDIT' ? 'UPDATE' : 'ADD'}
            </button>
        </div>
    );
};

export default AddEditNotes;
