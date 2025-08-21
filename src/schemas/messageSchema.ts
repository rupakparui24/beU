import {z} from 'zod';

export const messageSchema = z.object({
    content: z.string()
        .min(1, { message: 'Content cannot be empty' })
        .max(500, { message: 'Content must not exceed 500 characters' }),
})