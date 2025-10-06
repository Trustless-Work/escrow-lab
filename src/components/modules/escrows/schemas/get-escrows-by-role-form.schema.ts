import { z } from "zod";

export const getEscrowsByRoleSchema = z.object({
  role: z.enum([
    "approver",
    "platformAddress",
    "receiver",
    "releaseSigner",
    "disputeResolver",
    "serviceProvider",
  ]),
  roleAddress: z.string().min(1, "Role address is required"),
  page: z.number().min(1).optional(),
  orderDirection: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["createdAt", "updatedAt", "amount"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  maxAmount: z.number().min(0).optional(),
  minAmount: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  title: z.string().optional(),
  engagementId: z.string().optional(),
  status: z
    .enum(["working", "pendingRelease", "released", "resolved", "inDispute"])
    .optional(),
  type: z.enum(["single-release", "multi-release", "all"]).optional(),
  validateOnChain: z.boolean().optional(),
});
