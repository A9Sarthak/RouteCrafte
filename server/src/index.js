import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";
import ejs from "ejs";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/routecraft";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB at", MONGO_URI))
  .catch(err => console.error("MongoDB connection error:", err));

// Mongoose Models
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ["user"] },
  profile: {
    avatar: String,
    timezone: String,
    phone: String,
    preferences: {
      currency: String,
      units: String,
      theme: String
    }
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const journeySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ownerId: { type: String, required: true },
  title: { type: String, required: true },
  dateRange: String,
  checkpoints: Array,
  budget: Object,
  status: { type: String, default: "draft" },
  transport: Array,
  notes: String,
  visibility: { type: String, default: "private" }
}, { timestamps: true });

const Journey = mongoose.model("Journey", journeySchema);

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);

function getJwtSecret() {
  return process.env.JWT_SECRET || "dev-secret-change-me";
}

function toPublicUser(user) {
  if (!user) return null;
  const obj = user.toObject();
  delete obj.passwordHash;
  delete obj._id;
  delete obj.__v;
  return obj;
}

const app = express();
app.use(cors({ 
  origin: true, 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --- Multer Configuration ---
const uploadDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, req.auth.sub + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// --- Nodemailer Configuration ---
let transporter;
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return;
    }
    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
    console.log("Mock SMTP server initialized");
});

function authenticate(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Missing token cookie" });

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.auth = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function canModifyJourney(auth, journey) {
  if (!auth || !journey) return false;
  const isOwner = journey.ownerId === auth.sub;
  const isAdmin = (auth.roles || []).includes("superadmin") || (auth.roles || []).includes("admin");
  return isOwner || isAdmin;
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { sub: user.id, roles: user.roles, email: user.email, name: user.name },
    getJwtSecret(),
    { expiresIn: "8h" }
  );

  res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 8 * 60 * 60 * 1000 });
  res.json({ user: toPublicUser(user) });
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ error: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({
    id: `user-${nanoid(8)}`,
    name,
    email: email.toLowerCase(),
    passwordHash,
    roles: ["user"],
    profile: { avatar: "", timezone: "UTC", phone: "", preferences: { currency: "USD", units: "metric", theme: "light" } }
  });

  await newUser.save();

  const token = jwt.sign(
    { sub: newUser.id, roles: newUser.roles, email: newUser.email, name: newUser.name },
    getJwtSecret(),
    { expiresIn: "8h" }
  );

  res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 8 * 60 * 60 * 1000 });
  res.status(201).json({ user: toPublicUser(newUser) });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

app.get("/api/me", authenticate, async (req, res) => {
  const user = await User.findOne({ id: req.auth.sub });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: toPublicUser(user) });
});

app.post("/api/users/avatar", authenticate, upload.single("avatar"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  
  const avatarUrl = `http://localhost:${PORT}/uploads/avatars/${req.file.filename}`;
  const user = await User.findOneAndUpdate(
    { id: req.auth.sub },
    { $set: { "profile.avatar": avatarUrl } },
    { new: true }
  );
  
  if (!user) return res.status(404).json({ error: "User not found" });
  
  res.json({ user: toPublicUser(user) });
});

app.put("/api/users/profile", authenticate, async (req, res) => {
  const { fullName, currency, newPassword } = req.body || {};
  if (!fullName) return res.status(400).json({ error: "Full Name is required" });

  const updates = { name: fullName, "profile.preferences.currency": currency };
  if (newPassword) {
    updates.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  const user = await User.findOneAndUpdate(
    { id: req.auth.sub },
    { $set: updates },
    { new: true }
  );

  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: toPublicUser(user) });
});

app.get("/api/journeys", authenticate, async (req, res) => {
  const isAdmin = (req.auth.roles || []).includes("superadmin") || (req.auth.roles || []).includes("admin");
  const query = isAdmin ? {} : { ownerId: req.auth.sub };
  const journeys = await Journey.find(query);
  res.json({ journeys: journeys.map(j => {
    const obj = j.toObject();
    delete obj._id;
    delete obj.__v;
    return obj;
  })});
});

app.post("/api/journeys", authenticate, async (req, res) => {
  const payload = req.body || {};
  if (!payload.title) return res.status(400).json({ error: "Title is required" });

  const journey = new Journey({
    id: `journey-${nanoid(8)}`,
    ownerId: req.auth.sub,
    title: payload.title,
    dateRange: payload.dateRange || "",
    checkpoints: payload.checkpoints || [],
    budget: payload.budget || {},
    status: payload.status || "draft",
    transport: payload.transport || [],
    notes: payload.notes || "",
    visibility: payload.visibility || "private"
  });

  await journey.save();
  const obj = journey.toObject();
  delete obj._id; delete obj.__v;
  res.status(201).json({ journey: obj });
});

app.put("/api/journeys/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const journey = await Journey.findOne({ id });
  if (!journey) return res.status(404).json({ error: "Not found" });

  if (!canModifyJourney(req.auth, journey)) return res.status(403).json({ error: "Forbidden" });

  const updates = req.body || {};
  delete updates._id; delete updates.id; delete updates.ownerId; // prevent overriding crucial fields
  
  Object.assign(journey, updates);
  await journey.save();

  const obj = journey.toObject();
  delete obj._id; delete obj.__v;
  res.json({ journey: obj });
});

app.delete("/api/journeys/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const journey = await Journey.findOne({ id });
  if (!journey) return res.status(404).json({ error: "Not found" });

  if (!canModifyJourney(req.auth, journey)) return res.status(403).json({ error: "Forbidden" });

  await Journey.deleteOne({ id });
  res.status(204).end();
});

app.post("/api/journeys/:id/share", authenticate, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Target email is required" });
  
  const journey = await Journey.findOne({ id: req.params.id });
  if (!journey) return res.status(404).json({ error: "Not found" });
  
  const templatePath = path.join(__dirname, '../views/journey-share.ejs');
  ejs.renderFile(templatePath, { journey: journey.toObject() }, async (err, data) => {
    if (err) {
      console.error("Template rendering error:", err);
      return res.status(500).json({ error: "Template error" });
    }
    
    try {
      let info = await transporter.sendMail({
         from: '"RouteCraft App" <no-reply@routecraft.app>',
         to: email,
         subject: `Your RouteCraft Itinerary: ${journey.title}`,
         html: data,
      });
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("Email sent! Preview URL: %s", previewUrl);
      res.json({ success: true, preview: previewUrl });
    } catch (sendErr) {
      console.error(sendErr);
      res.status(500).json({ error: "Failed to send email" });
    }
  });
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const contactMsg = new Contact({ name, email, message });
    await contactMsg.save();

    res.status(201).json({ success: true, message: "Message received" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to submit message" });
  }
});

app.post("/api/admin/login", (req, res) => {
  const { empId, password } = req.body || {};
  if (empId === "121" && password === "abc121") {
    const token = jwt.sign(
      { sub: "admin", roles: ["superadmin"] },
      getJwtSecret(),
      { expiresIn: "8h" }
    );
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 8 * 60 * 60 * 1000 });
    return res.json({ success: true });
  }
  return res.status(401).json({ error: "Invalid admin credentials" });
});

app.get("/api/admin/stats", authenticate, async (req, res) => {
  if (!(req.auth.roles || []).includes("superadmin")) {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    const userCount = await User.countDocuments();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ userCount, contacts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`RouteCraft API listening on http://localhost:${PORT}`);
});
// Nodemon trigger updated
