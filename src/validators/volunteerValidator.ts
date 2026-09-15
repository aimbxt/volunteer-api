import * as z from "zod";

export const VolunteerSchema = z.object({
    name: z.string().trim().nonempty(),
    email: z.email()
})

export const updateVolunteerSchema = VolunteerSchema.partial();
