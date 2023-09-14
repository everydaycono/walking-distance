import { z } from 'zod';

export const articleValidator = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  // content: z.string().max(3000, 'Content must be less than 3000 characters'),
  tags: z.string(),
  category: z.string().min(3, 'Category must be selected')
  // this only aviliable when category is custom
  // customCategory: z.string().optional()
});
