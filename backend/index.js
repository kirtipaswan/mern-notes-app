require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
    cors({
       origin: [
            'http://localhost:5173', // <--- Add your local development URL
            'https://mern-notes-app-ashen.vercel.app' // <--- Your Vercel production URL
        ],
    })
);

app.get("/", (req, res) => {
    res.json({ data: "Hello World!" });
});

// Backend API Endpoints, Ready!!! Let's go!!! 🚀🚀🚀

// create account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full name is required" });
    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.status(400).json({ error: true, message: "Email already exists" });
    }

    const user = new User({
        fullName,
        email,
        password
    });

    await user.save();

    const accessToken = jwt.sign({ user: { _id: user._id, email: user.email } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m" });

    console.log(user)
    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
});

// login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ error: true, message: "User not found" });
    }

    if (userInfo.password !== password) {
        return res.status(400).json({ error: true, message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ user: { _id: userInfo._id, email: userInfo.email } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m" });

    console.log(userInfo)
    return res.json({
        error: false,
        message: "Login Successful",
        email,
        accessToken,
    });
});

// get user
app.get("/get-user", authenticateToken, async (req, res) => {
    const user = req.user;

    const isUser = await User.findOne({_id: user._id});

    if (!isUser) {
        return res.status(400).json({ error: true, message: "User not found" });
    }

    return res.json({ error: false, user : {fullName: isUser.fullName, email: isUser.email, "_id": isUser._id, createdOn: isUser.createdOn}, message: "User fetched successfully" });
});

// add note
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const user = req.user; // Now this should contain just the user object

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }

    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id // This should now work correctly
        });

        await note.save();

        return res.json({ error: false, note, message: "Note added successfully" });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
});

// edit note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const user = req.user;

    if (!title && !content && !tags && !isPinned) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({_id: noteId, userId: user._id});
        if (!note) {
            return res.status(400).json({ error: true, message: "Note not found" });
        }
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({ error: false, note, message: "Note updated successfully" });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
});

// get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const user = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

        return res.json({ error: false, notes, message: "Notes fetched successfully" });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
});

// delete note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const user = req.user;

    try {
        const note = await Note.findOne({_id: noteId, userId: user._id});
        if (!note) {
            return res.status(400).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne();

        return res.json({ error: false, message: "Note deleted successfully" });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
});

// update isPinned status
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {isPinned} = req.body;
    const user = req.user;

    try {
        const note = await Note.findOne({_id: noteId, userId: user._id});
        if (!note) {
            return res.status(400).json({ error: true, message: "Note not found" });
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({ error: false, note, message: "Note pinned status updated successfully" });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
});

// search notes
app.get("/search-notes", authenticateToken, async (req, res) => {
    const user = req.user;
    const { query } = req.query;

    if(!query) {
        return res.status(400).json({ error: true, message: "Query is required"})
    }

    try {
        const notes = await Note.find({ userId: user._id, $or: [
            { title: { $regex: new  RegExp(query, 'i') } },
            { content: { $regex: new  RegExp(query, 'i') } },
            { tags: { $regex: new  RegExp(query, 'i') } }
        ] });

        return res.json({ error: false, notes, message: "Notes fetched successfully" });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

module.exports = app;

