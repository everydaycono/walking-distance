import { z } from 'zod';

export const articleValidator = z.object({
  title: z.string(),
  content: z.string().max(3000, 'Content must be less than 3000 characters'),
  tags: z.string(),
  category: z.string(),
  // this only aviliable when category is custom
  customCategory: z.string().optional()
});
