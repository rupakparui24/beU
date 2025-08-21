import { z } from 'zod';

export const usernameSchema = z
.string()
.min(3, { message: 'Username must be at least 3 characters long' })
.max(20, { message: 'Username must not exceed 20 characters' })
.regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' });


export const signupSchema = z.object({
    username : usernameSchema,
    email: z
        .string()
        .email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
})