import * as z from "zod";

export const ShiftSchema = z.object({
    title: z.string().trim().nonempty(),
    location: z.string().trim().nonempty(),
    description: z.string().trim().nonempty().optional(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    capacity: z.number().min(1)
}).refine((data) => data.endTime > data.startTime, {
  message: "endTime must be after startTime",
  path: ["endTime"],
});

export const updateShiftSchema = ShiftSchema.partial().refine(
  (data) => data.startTime === undefined || data.endTime === undefined || data.endTime > data.startTime,
  {
    message: "endTime must be after startTime",
    path: ["endTime"],
  }
);