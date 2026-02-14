const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');

/**
 * @route   POST /api/topics
 * @desc    Create a new topic
 * @access  Public
 */
router.post('/', async (req, res) => {
    try {
        console.log('✅ Creating topic...');

        const { className, subjectName, lessonName, topicName, videoLink, topicContent } = req.body;

        // Validation
        if (!className || !topicName || !topicContent) {
            return res.status(400).json({
                success: false,
                message: "Please provide className, topicName, and topicContent"
            });
        }

        const newTopic = new Topic({
            className,
            subjectName: subjectName || "",
            lessonName: lessonName || "",
            topicName,
            videoLink: videoLink || "",
            topicContent
        });

        const savedTopic = await newTopic.save();

        console.log('✅ Topic created');

        res.status(201).json({
            success: true,
            message: "Topic created successfully",
            topic: savedTopic
        });
    } catch (error) {
        console.error('❌ Error creating topic');
        res.status(500).json({
            success: false,
            message: "Error creating topic",
            error: error.message
        });
    }
});

/**
 * @route   GET /api/topics
 * @desc    Get all topics
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        console.log('📋 Fetching topics...');

        const topics = await Topic.find().sort({ createdAt: -1 });

        console.log(`✅ Found ${topics.length} topics`);

        res.status(200).json({
            success: true,
            count: topics.length,
            topics
        });
    } catch (error) {
        console.error('❌ Error fetching topics');
        res.status(500).json({
            success: false,
            message: "Error fetching topics",
            error: error.message
        });
    }
});

/**
 * @route   GET /api/topics/lessons
 * @desc    Get all unique lesson names (for dropdown)
 * @access  Public
 */
router.get('/lessons', async (req, res) => {
    try {
        console.log('📚 Fetching lesson names...');

        // First, try to get lessons from Lesson collection
        try {
            const lessonsFromDB = await Lesson.find({}, 'lessonName').sort({ lessonName: 1 });
            let lessonNames = lessonsFromDB.map(lesson => lesson.lessonName);

            // Remove duplicates and empty values
            lessonNames = [...new Set(lessonNames.filter(name => name && name.trim() !== ''))];

            if (lessonNames.length > 0) {
                console.log(`✅ Found ${lessonNames.length} lesson names`);
                return res.status(200).json({
                    success: true,
                    count: lessonNames.length,
                    lessons: lessonNames
                });
            }
        } catch (lessonError) {
            console.log('⚠️ Fetching from lessons collection failed');
        }

        // Fallback: Get unique lesson names from Topic collection
        let uniqueLessons = await Topic.distinct('lessonName');

        // Filter out empty strings
        uniqueLessons = uniqueLessons.filter(lesson => lesson && lesson.trim() !== '');

        console.log(`✅ Found ${uniqueLessons.length} lesson names`);

        res.status(200).json({
            success: true,
            count: uniqueLessons.length,
            lessons: uniqueLessons
        });
    } catch (error) {
        console.error('❌ Error fetching lessons');
        res.status(500).json({
            success: false,
            message: "Error fetching lessons",
            error: error.message,
            lessons: []
        });
    }
});

/**
 * @route   GET /api/topics/:id
 * @desc    Get single topic by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Fetching topic...`);

        const topic = await Topic.findById(id);

        if (!topic) {
            console.log(`❌ Topic not found`);
            return res.status(404).json({
                success: false,
                message: "Topic not found"
            });
        }

        console.log(`✅ Topic found`);

        res.status(200).json({
            success: true,
            topic
        });
    } catch (error) {
        console.error('❌ Error fetching topic');
        res.status(500).json({
            success: false,
            message: "Error fetching topic",
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/topics/:id
 * @desc    Update topic
 * @access  Public
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`✏️  Updating topic...`);

        const { className, subjectName, lessonName, topicName, videoLink, topicContent } = req.body;

        // Check if topic exists
        const existingTopic = await Topic.findById(id);
        if (!existingTopic) {
            return res.status(404).json({
                success: false,
                message: "Topic not found"
            });
        }

        // Update topic
        const updatedTopic = await Topic.findByIdAndUpdate(
            id,
            {
                className,
                subjectName: subjectName || "",
                lessonName: lessonName || "",
                topicName,
                videoLink: videoLink || "",
                topicContent
            },
            {
                new: true,
                runValidators: true
            }
        );

        console.log(`✅ Topic updated`);

        res.status(200).json({
            success: true,
            message: "Topic updated successfully",
            topic: updatedTopic
        });
    } catch (error) {
        console.error('❌ Error updating topic');
        res.status(500).json({
            success: false,
            message: "Error updating topic",
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/topics/:id
 * @desc    Delete topic
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️  Deleting topic...`);

        const deletedTopic = await Topic.findByIdAndDelete(id);

        if (!deletedTopic) {
            console.log(`❌ Topic not found`);
            return res.status(404).json({
                success: false,
                message: "Topic not found"
            });
        }

        console.log(`✅ Topic deleted`);

        res.status(200).json({
            success: true,
            message: "Topic deleted successfully",
            topic: deletedTopic
        });
    } catch (error) {
        console.error('❌ Error deleting topic');
        res.status(500).json({
            success: false,
            message: "Error deleting topic",
            error: error.message
        });
    }
});

module.exports = router;