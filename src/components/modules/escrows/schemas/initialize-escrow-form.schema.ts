import { isValidWallet } from "@/helpers/is-valid-wallet.helper";
import { z } from "zod";

export const formSchemaSingleRelease = z.object({
  signer: z.string().min(1, {
    message: "Signer is required.",
  }),
  engagementId: z.string().min(1, {
    message: "Engagement is required.",
  }),
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long.",
  }),
  amount: z.number().min(1, {
    message: "Amount is required.",
  }),
  platformFee: z.number().min(0, {
    message: "Platform fee must be a non-negative number.",
  }),
  receiverMemo: z.number().min(0, {
    message: "Receiver memo must be a non-negative number.",
  }),
  roles: z.object({
    approver: z
      .string()
      .min(1, {
        message: "Approver is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Approver must be a valid wallet.",
      }),
    serviceProvider: z
      .string()
      .min(1, {
        message: "Service provider is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Service provider must be a valid wallet.",
      }),
    platformAddress: z
      .string()
      .min(1, {
        message: "Platform address is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Platform address must be a valid wallet.",
      }),
    releaseSigner: z
      .string()
      .min(1, {
        message: "Release signer is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Release signer must be a valid wallet.",
      }),
    disputeResolver: z
      .string()
      .min(1, {
        message: "Dispute resolver is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Dispute resolver must be a valid wallet.",
      }),
    receiver: z
      .string()
      .min(1, {
        message: "Receiver address is required.",
      })
      .refine((value) => isValidWallet(value), {
        message: "Receiver address must be a valid wallet.",
      }),
  }),
  trustline: z.object({
    address: z.string().min(1, {
      message: "Trustline address is required.",
    }),
  }),
  milestones: z
    .array(
      z.object({
        description: z.string().min(1, {
          message: "Milestone description is required.",
        }),
      })
    )
    .min(1, { message: "At least one milestone is required." }),
});

// Create multiRelease by omitting amount
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { amount: _, ...multiReleaseFields } = formSchemaSingleRelease.shape;

export const formSchemaMultiRelease = z.object({
  ...multiReleaseFields,
  milestones: z
    .array(
      z.object({
        description: z.string().min(1, {
          message: "Milestone description is required.",
        }),
        amount: z.number().min(1, {
          message: "Milestone amount is required.",
        }),
      })
    )
    .min(1, { message: "At least one milestone is required." }),
});
