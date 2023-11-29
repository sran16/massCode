import { z } from "zod";

const SnippetValidator = z.object({
  title: z.string(),
  content: z.string(),
  language: z.string(),
});

export default SnippetValidator;
