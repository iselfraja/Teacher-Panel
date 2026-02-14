import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Lessons API calls
export const lessonAPI = {
    // Get all lessons
    getAllLessons: async () => {
        try {
            const response = await api.get('/lessons');
            return response.data;
        } catch (error) {
            console.error('Error fetching lessons:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch lessons');
        }
    },

    // Get lesson names for dropdown
    getLessonNames: async () => {
        try {
            const response = await api.get('/lessons/names');
            return response.data;
        } catch (error) {
            console.error('Error fetching lesson names:', error);
            // Return empty array on error
            return { success: true, lessons: [] };
        }
    },

    // Get single lesson by ID
    getLessonById: async (id) => {
        try {
            const response = await api.get(`/lessons/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching lesson:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch lesson');
        }
    },

    // Create new lesson
    createLesson: async (lessonData) => {
        try {
            const response = await api.post('/lessons', lessonData);
            return response.data;
        } catch (error) {
            console.error('Error creating lesson:', error);
            throw new Error(error.response?.data?.message || 'Failed to create lesson');
        }
    },

    // Update lesson
    updateLesson: async (id, lessonData) => {
        try {
            const response = await api.put(`/lessons/${id}`, lessonData);
            return response.data;
        } catch (error) {
            console.error('Error updating lesson:', error);
            throw new Error(error.response?.data?.message || 'Failed to update lesson');
        }
    },

    // Delete lesson
    deleteLesson: async (id) => {
        try {
            const response = await api.delete(`/lessons/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting lesson:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete lesson');
        }
    },
};

// Topics API calls
export const topicAPI = {
    // Get all topics
    getAllTopics: async () => {
        try {
            const response = await api.get('/topics');
            return response.data;
        } catch (error) {
            console.error('Error fetching topics:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch topics');
        }
    },

    // Get lessons for dropdown
    getLessonsForDropdown: async () => {
        try {
            const response = await api.get('/topics/lessons');
            return response.data;
        } catch (error) {
            console.error('Error fetching lessons for dropdown:', error);
            // If this fails, try to get from lessons API
            try {
                const lessonsResponse = await lessonAPI.getLessonNames();
                return lessonsResponse;
            } catch (fallbackError) {
                // Return empty array if both fail
                return { success: true, lessons: [] };
            }
        }
    },

    // Get single topic by ID
    getTopicById: async (id) => {
        try {
            const response = await api.get(`/topics/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching topic:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch topic');
        }
    },

    // Create new topic
    createTopic: async (topicData) => {
        try {
            const response = await api.post('/topics', topicData);
            return response.data;
        } catch (error) {
            console.error('Error creating topic:', error);
            throw new Error(error.response?.data?.message || 'Failed to create topic');
        }
    },

    // Update topic
    updateTopic: async (id, topicData) => {
        try {
            const response = await api.put(`/topics/${id}`, topicData);
            return response.data;
        } catch (error) {
            console.error('Error updating topic:', error);
            throw new Error(error.response?.data?.message || 'Failed to update topic');
        }
    },

    // Delete topic
    deleteTopic: async (id) => {
        try {
            const response = await api.delete(`/topics/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting topic:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete topic');
        }
    },
};

// Test API connection
export const testAPIConnection = async () => {
    try {
        const response = await api.get('/');
        console.log('✅ API Connection Successful:', response.data);
        return true;
    } catch (error) {
        console.error('❌ API Connection Failed:', error.message);
        console.log('ℹ️  Please make sure backend server is running on port 5000');
        return false;
    }
};

export default api;