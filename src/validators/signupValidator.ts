import * as z from "zod";

import mongoose from "mongoose";

export const SignupSchema = z.object({
  volunteerId: z.string().trim().nonempty().refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    { message: "volunteerId must be a valid ObjectId" }
  )
});