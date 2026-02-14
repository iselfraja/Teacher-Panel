const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    lessonName: {
        type: String,
        required: [true, "Lesson name is required"],
        trim: true,
        minlength: [2, "Lesson name must be at least 2 characters long"],
        maxlength: [100, "Lesson name cannot exceed 100 characters"]
    },
    className: {
        type: String,
        required: [true, "Class name is required"],
        trim: true,
        enum: {
            values: ['LKG', 'UKG', 'Nur', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
            message: 'Please select a valid class'
        }
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
        minlength: [10, "Content must be at least 10 characters long"]
    },
    subject: {
        type: String,
        trim: true,
        default: "",
        maxlength: [50, "Subject cannot exceed 50 characters"]
    },
    filePath: {
        type: String,
        trim: true,
        default: ""
    },
    fileName: {
        type: String,
        trim: true,
        default: ""
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create indexes for better performance
lessonSchema.index({ className: 1 });
lessonSchema.index({ lessonName: 'text', content: 'text' });

// Virtual for topics related to this lesson
lessonSchema.virtual('topics', {
    ref: 'Topic',
    localField: 'lessonName',
    foreignField: 'lessonName',
    justOne: false
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;