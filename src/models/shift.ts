import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IShift {
    title: string;
    description?: string;
    location: string;
    startTime: Date;
    endTime: Date;
    capacity: number;
    confirmedCount: number;
    createdAt: Date;
    updatedAt: Date
}

const shiftSchema = new Schema<IShift>({
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
    },
    confirmedCount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

shiftSchema.virtual('spotsLeft').get(function() {
    return Math.max(this.capacity - this.confirmedCount, 0);
});

shiftSchema.virtual('isFull').get(function() {
    return this.confirmedCount >= this.capacity;
});

export const Shift = mongoose.model<IShift>("Shift", shiftSchema);