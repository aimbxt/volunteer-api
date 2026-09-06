import mongoose from 'mongoose';
const { Schema } = mongoose;

const shiftSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    startTime: {
        type: Date,
        required: true
    }, 
    endTime: {
        type: Date,
        required: true
    }, 
    capacity: {
        type: Number,
        required: true,
        min: 1
    }
}, {timestamps: true});

export const Shift = mongoose.model("Shift", shiftSchema);