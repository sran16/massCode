import { z } from "zod";

const UserValidator = z.object({
  email: z.string(),
  password: z.string(),
  photo: z.string().optional(),
});

export default UserValidator;
