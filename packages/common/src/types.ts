import { z } from "zod"; 

export const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name:z.string().min(3).max(20),
    // photo:z.string().url()
  });
  
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });


export const createRoomSchema = z.object({
    name:z.string().min(3).max(20)
})