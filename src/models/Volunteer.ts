import mongoose, { Document } from 'mongoose';

export interface IVolunteer extends Document {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const volunteerSchema = new mongoose.Schema<IVolunteer>({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, {
    timestamps: true
});

export const Volunteer = mongoose.model<IVolunteer>("Volunteer", volunteerSchema);