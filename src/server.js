require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: "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",
});

const app = express();
const PORT = 5000;
const SECRET_KEY = "iY1qpX#3Fw93!2m";

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/yachtgpt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
});

const User = mongoose.model("User", userSchema);

// Chat History Schema
const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messages: [{ text: String, sender: String }],
});

const Chat = mongoose.model("Chat", chatSchema);

// Register Endpoint
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User successfully registered" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ username: user.username, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Profile Picture Update Endpoint
app.post("/profile-picture", async (req, res) => {
  const { profilePicture } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = profilePicture;
    await user.save();

    res.json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ChatGPT API Endpoint (Handles Chat History & Responses)
app.post("/chat", async (req, res) => {
  const { messages } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    // ✅ FIXED: Ensure `openai` is used properly
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are AatishGPT, a basketball expert who loves to talk about hoops and life, your favorite basketball team is the warriors and your favorite player is curry and your least favorite player is Lebron" },
        ...messages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
      ],
      max_tokens: 100,
      temperature:0.7,
      stream: true,
    });

    const aiReply = response.choices[0].message.content;

    // Store chat in MongoDB
    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    chat.messages.push({ text: messages[messages.length - 1].text, sender: "user" });
    chat.messages.push({ text: aiReply, sender: "chatgpt" });

    await chat.save();

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ message: "Error generating response" });
  }
});

// Retrieve Chat History
app.get("/chat-history", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const chat = await Chat.findOne({ userId: decoded.id });

    res.json(chat ? chat.messages : []);
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
