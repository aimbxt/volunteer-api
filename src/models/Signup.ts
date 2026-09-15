import mongoose from "mongoose";

export interface ISignup {
  volunteer: mongoose.Types.ObjectId;
  shift: mongoose.Types.ObjectId;
  status: 'confirmed' | 'waitlisted' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
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
    },
    
  },
  {
    timestamps: true,
  }
)

signupSchema.index(
  { volunteer: 1, shift: 1},
  {
    unique: true,
    partialFilterExpression: { status: { $ne: "cancelled"}}
  }
)

export const Signup = mongoose.model<ISignup>("Signup", signupSchema)