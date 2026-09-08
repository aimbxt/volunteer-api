import mongoose from "mongoose";

const signupSchema = new mongoose.Schema({
    shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
    },
    volunteerName: {
      type: String,
      required: true,
      trim: true,
    },
    volunteerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Signup = mongoose.model("Signup", signupSchema)