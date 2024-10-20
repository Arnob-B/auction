import {z} from "zod";

export const loginSchema = z.object({
    id: z.string().min(1,"UserId is required."),
    password: z.string().min(1,"Password is required."),
    adminCode: z.string()
  })