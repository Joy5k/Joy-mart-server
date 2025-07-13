import { z } from 'zod';

// Zod schemas
export const submitTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required')
  })
});

export const sendNotificationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Body is required')
  })
});

export const pushNotificationValidation = {
  submitTokenSchema,
  sendNotificationSchema
};