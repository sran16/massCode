import { z } from "zod";

const SnippetValidator = z.object({
  title: z.string(),
  content: z.string(),
  language: z.string(),
  categoryId: z.number(),
  userId: z.number(),
});

export default SnippetValidator;
