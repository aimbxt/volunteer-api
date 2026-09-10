import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});