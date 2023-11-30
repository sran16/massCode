import { z } from "zod";

const CategoryValidator = z.object({
  name: z.string()
});

export default CategoryValidator;
