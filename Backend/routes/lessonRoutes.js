const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");

/**
 * @route   POST /api/lessons
 * @desc    Create a new lesson
 * @access  Public
 */
router.post("/", async (req, res) => {
    try {
        console.log("✅ Creating lesson...");

        const { lessonName, className, content, subject } = req.body;

        // Validation
        if (!lessonName || !className || !content) {
            return res.status(400).json({
                success: false,
                message: "Please provide lessonName, className, and content"
            });
        }

        const newLesson = new Lesson({
            lessonName,
            className,
            content,
            subject: subject || ""
        });

        const savedLesson = await newLesson.save();

        console.log("✅ Lesson created");

        res.status(201).json({
            success: true,
            message: "Lesson created successfully",
            lesson: savedLesson
        });
    } catch (error) {
        console.error("❌ Error creating lesson");
        res.status(500).json({
            success: false,
            message: "Error creating lesson",
            error: error.message
        });
    }
});

/**
 * @route   GET /api/lessons
 * @desc    Get all lessons
 * @access  Public
 */
router.get("/", async (req, res) => {
    try {
        console.log("📋 Fetching lessons...");

        const lessons = await Lesson.find().sort({ createdAt: -1 });

        console.log(`✅ Found ${lessons.length} lessons`);

        res.status(200).json({
            success: true,
            count: lessons.length,
            lessons
        });
    } catch (error) {
        console.error("❌ Error fetching lessons");
        res.status(500).json({
            success: false,
            message: "Error fetching lessons",
            error: error.message
        });
    }
});

/**
 * @route   GET /api/lessons/names
 * @desc    Get lesson names for dropdown
 * @access  Public
 */
router.get("/names", async (req, res) => {
    try {
        console.log("📚 Fetching lesson names...");

        // Get only lessonName field, sorted alphabetically
        const lessons = await Lesson.find({}, 'lessonName').sort({ lessonName: 1 });

        // Extract unique lesson names
        const lessonNames = lessons.map(lesson => lesson.lessonName);

        // Remove duplicates and empty values
        const uniqueLessonNames = [...new Set(lessonNames.filter(name => name && name.trim() !== ''))];

        console.log(`✅ Found ${uniqueLessonNames.length} lesson names`);

        res.status(200).json({
            success: true,
            count: uniqueLessonNames.length,
            lessons: uniqueLessonNames
        });
    } catch (error) {
        console.error("❌ Error fetching lesson names");
        res.status(500).json({
            success: false,
            message: "Error fetching lesson names",
            error: error.message,
            lessons: []
        });
    }
});

/**
 * @route   GET /api/lessons/with-class
 * @desc    Get lessons with class information for dropdown
 * @access  Public
 */
router.get("/with-class", async (req, res) => {
    try {
        console.log("🏫 Fetching lessons with class...");

        const lessons = await Lesson.find({}, 'lessonName className').sort({ lessonName: 1 });

        const formattedLessons = lessons.map(lesson => ({
            lessonName: lesson.lessonName,
            className: lesson.className,
            displayName: `${lesson.lessonName} (${lesson.className})`
        }));

        console.log(`✅ Found ${formattedLessons.length} lessons`);

        res.status(200).json({
            success: true,
            count: formattedLessons.length,
            lessons: formattedLessons
        });
    } catch (error) {
        console.error("❌ Error fetching lessons with class");
        res.status(500).json({
            success: false,
            message: "Error fetching lessons with class",
            error: error.message
        });
    }
});

/**
 * @route   GET /api/lessons/by-class/:className
 * @desc    Get lessons by specific class
 * @access  Public
 */
router.get("/by-class/:className", async (req, res) => {
    try {
        const { className } = req.params;
        console.log(`🏫 Fetching lessons for class: ${className}`);

        const lessons = await Lesson.find({ className }).sort({ lessonName: 1 });

        console.log(`✅ Found ${lessons.length} lessons`);

        res.status(200).json({
            success: true,
            count: lessons.length,
            className,
            lessons
        });
    } catch (error) {
        console.error("❌ Error fetching lessons by class");
        res.status(500).json({
            success: false,
            message: "Error fetching lessons by class",
            error: error.message
        });
    }
});

/**
 * @route   GET /api/lessons/:id
 * @desc    Get single lesson by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Fetching lesson...`);

        const lesson = await Lesson.findById(id);

        if (!lesson) {
            console.log(`❌ Lesson not found`);
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }

        console.log(`✅ Lesson found`);

        res.status(200).json({
            success: true,
            lesson
        });
    } catch (error) {
        console.error("❌ Error fetching lesson");
        res.status(500).json({
            success: false,
            message: "Error fetching lesson",
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/lessons/:id
 * @desc    Update lesson
 * @access  Public
 */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`✏️  Updating lesson...`);

        const { lessonName, className, content, subject } = req.body;

        // Check if lesson exists
        const existingLesson = await Lesson.findById(id);
        if (!existingLesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }

        // Update lesson
        const updatedLesson = await Lesson.findByIdAndUpdate(
            id,
            {
                lessonName,
                className,
                content,
                subject: subject || ""
            },
            {
                new: true,
                runValidators: true
            }
        );

        console.log(`✅ Lesson updated`);

        res.status(200).json({
            success: true,
            message: "Lesson updated successfully",
            lesson: updatedLesson
        });
    } catch (error) {
        console.error("❌ Error updating lesson");
        res.status(500).json({
            success: false,
            message: "Error updating lesson",
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/lessons/:id
 * @desc    Delete lesson
 * @access  Public
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️  Deleting lesson...`);

        const deletedLesson = await Lesson.findByIdAndDelete(id);

        if (!deletedLesson) {
            console.log(`❌ Lesson not found`);
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }

        console.log(`✅ Lesson deleted`);

        res.status(200).json({
            success: true,
            message: "Lesson deleted successfully",
            lesson: deletedLesson
        });
    } catch (error) {
        console.error("❌ Error deleting lesson");
        res.status(500).json({
            success: false,
            message: "Error deleting lesson",
            error: error.message
        });
    }
});

module.exports = router;