import { z } from "zod";

const STELLAR_CONTRACT_ID_REGEX = /^C[A-Z2-7]{55}$/;

export const formSchema = z.object({
  contractIds: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, "Contract ID is required")
          .regex(STELLAR_CONTRACT_ID_REGEX, "Invalid Stellar Contract ID"),
      })
    )
    .min(1, "At least one contract ID is required"),
  validateOnChain: z.boolean(),
});
