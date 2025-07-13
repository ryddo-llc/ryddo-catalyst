import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Please enter a valid email address').trim(),
  phone: z.string().optional(),
  howDidYouFindUs: z.string().optional(),
}); 