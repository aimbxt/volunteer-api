import * as z from "zod";

export const registerSchema = z.object({
    name: z.string().trim().nonempty(),
    email: z.email(),
    password: z.string().min(8).max(72)
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().nonempty()
});