import { z } from "zod";

export const formSchema = z.object({
  contractIds: z
    .array(
      z.object({
        value: z.string().min(1, "Contract ID is required"),
      })
    )
    .min(1, "At least one contract ID is required"),
  signer: z.string().min(1, "Signer Address is required"),
  validateOnChain: z.boolean(),
});
