const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Updated for Mongoose 7+)
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/school_management");
        console.log("✅ MongoDB Connected Successfully!");

        // Log connection details
        const db = mongoose.connection;
        console.log(`📊 Database: ${db.name}`);
        console.log(`🔗 Host: ${db.host}`);
        console.log(`🎯 Port: ${db.port}`);

    } catch (error) {
        console.log("❌ MongoDB Connection Error:", error.message);
        console.log("💡 Tips:");
        console.log("1. Make sure MongoDB is installed and running");
        console.log("2. Run 'mongod' in another terminal");
        console.log("3. Or start MongoDB service");
        console.log("4. Check if MongoDB Compass can connect to mongodb://localhost:27017");
    }
};

connectDB();

// Import Routes
const lessonRoutes = require("./routes/lessonRoutes");
const topicRoutes = require("./routes/topicRoutes");

// Welcome Route
app.get("/", (req, res) => {
    res.json({
        message: "🎉 School Management API is Running!",
        status: "active",
        timestamp: new Date().toISOString(),
        endpoints: {
            lessons: {
                base: "/api/lessons",
                get_all: "GET /api/lessons",
                create: "POST /api/lessons",
                get_one: "GET /api/lessons/:id",
                update: "PUT /api/lessons/:id",
                delete: "DELETE /api/lessons/:id",
                names: "GET /api/lessons/names"
            },
            topics: {
                base: "/api/topics",
                get_all: "GET /api/topics",
                create: "POST /api/topics",
                get_one: "GET /api/topics/:id",
                update: "PUT /api/topics/:id",
                delete: "DELETE /api/topics/:id",
                lessons: "GET /api/topics/lessons"
            }
        },
        frontend: "http://localhost:3000",
        database: "school_management",
        server_time: new Date().toISOString()
    });
});

// Test Route
app.get("/api/test", (req, res) => {
    res.json({
        message: "✅ API is working!",
        status: "success",
        server_time: new Date().toISOString(),
        version: "1.0.0"
    });
});

// Health Check Route
app.get("/api/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting"
    }[dbStatus] || "unknown";

    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: {
            status: dbStatusText,
            connected: dbStatus === 1,
            name: mongoose.connection.name
        },
        server: {
            uptime: process.uptime(),
            platform: process.platform,
            node_version: process.version
        }
    });
});

// API Routes
app.use("/api/lessons", lessonRoutes);
app.use("/api/topics", topicRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.message);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.url}`,
        available_endpoints: {
            lessons: "/api/lessons",
            topics: "/api/topics",
            health: "/api/health",
            test: "/api/test"
        }
    });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on port ${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test Route: http://localhost:${PORT}/api/test`);
    console.log(`📝 Lessons API: http://localhost:${PORT}/api/lessons`);
    console.log(`📖 Topics API: http://localhost:${PORT}/api/topics`);
    console.log(`\n📊 MongoDB: mongodb://127.0.0.1:27017/school_management`);
    console.log(`💡 Frontend: http://localhost:3000`);
});