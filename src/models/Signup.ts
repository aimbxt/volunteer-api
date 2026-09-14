import mongoose from "mongoose";

export interface ISignup {
  volunteer: mongoose.Types.ObjectId;
  shift: mongoose.Types.ObjectId;
  status: 'confirmed' | 'waitlisted' | 'cancelled';
}

const signupSchema = new mongoose.Schema<ISignup>({
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      required: true
    },
    shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true
    },
    status: {
      type: String,
      enum: ["confirmed", "waitlisted", "cancelled"],
      required: true
    }
    
  },
  {
    timestamps: true,
  }
)

export const Signup = mongoose.model<ISignup>("Signup", signupSchema)