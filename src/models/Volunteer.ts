import mongoose from 'mongoose';

export interface IVolunteer {
  name: String;
  email: String;
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