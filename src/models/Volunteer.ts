import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type VolunteerRole = 'volunteer' | 'admin';

export interface IVolunteer extends Document {
  name: string;
  email: string;
  password?: string;
  role: VolunteerRole;
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
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    role: {
        type: String,
        enum: ['volunteer', 'admin'],
        default: 'volunteer',
        required: true
    }
}, {
    timestamps: true
});

volunteerSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
});

export const Volunteer = mongoose.model<IVolunteer>("Volunteer", volunteerSchema);