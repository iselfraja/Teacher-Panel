const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    className: {
        type: String,
        required: [true, "Class name is required"],
        trim: true
    },
    subjectName: {
        type: String,
        trim: true,
        default: ""
    },
    lessonName: {
        type: String,
        trim: true,
        default: ""
    },
    topicName: {
        type: String,
        required: [true, "Topic name is required"],
        trim: true
    },
    videoLink: {
        type: String,
        trim: true,
        default: ""
    },
    topicContent: {
        type: String,
        required: [true, "Topic content is required"],
        trim: true
    },
    fileName: {
        type: String,
        trim: true,
        default: ""
    },
    filePath: {
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
topicSchema.index({ className: 1 });
topicSchema.index({ lessonName: 1 });
topicSchema.index({ topicName: 'text', topicContent: 'text' });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;