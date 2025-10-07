import { z } from "zod";

export const formSchema = z.object({
  addresses: z
    .array(
      z.object({
        value: z.string().min(1, "Address is required"),
      })
    )
    .min(1, "At least one address is required"),
});
