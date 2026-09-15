import * as z from "zod";

const BaseShiftSchema = z.object({
    title: z.string().trim().nonempty(),
    location: z.string().trim().nonempty(),
    description: z.string().trim().nonempty().optional(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    capacity: z.number().min(1)
});

export const CreateShiftSchema = BaseShiftSchema.refine(
  (data) => data.endTime > data.startTime,
  { message: "endTime must be after startTime", path: ["endTime"] }
);

export const UpdateShiftSchema = BaseShiftSchema.partial();