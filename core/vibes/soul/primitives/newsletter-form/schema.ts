import { z } from 'zod';

export const newsletterSchema = z.object({
  name: z
    .string()
    .trim()
    .max(60, 'Name must be 60 characters or fewer')
    .optional()
    .or(z.literal('')),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address'),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>; 