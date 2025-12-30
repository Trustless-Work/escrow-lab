"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { WalletError } from "@/@types/errors.entity";
import {
  GetEscrowsFromIndexerByRoleParams,
  GetEscrowsFromIndexerResponse,
} from "@trustless-work/escrow/types";
import { useGetEscrowsFromIndexerByRole } from "@trustless-work/escrow/hooks";
import { getEscrowsByRoleSchema } from "../schemas/get-escrows-by-role-form.schema";
import { useWalletContext } from "@/components/tw-blocks/wallet-kit/WalletProvider";

export const useGetEscrowsByRoleForm = () => {
  const { getEscrowsByRole } = useGetEscrowsFromIndexerByRole();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<
    GetEscrowsFromIndexerResponse[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const { walletAddress } = useWalletContext();

  const form = useForm<z.infer<typeof getEscrowsByRoleSchema>>({
    resolver: zodResolver(getEscrowsByRoleSchema),
    defaultValues: {
      role: "approver",
      roleAddress: walletAddress || "",
      page: 1,
      orderDirection: "desc",
      orderBy: "createdAt",
      validateOnChain: true,
      type: "all",
    },
  });

  const onSubmit = async (payload: z.infer<typeof getEscrowsByRoleSchema>) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Build filters object with proper typing - all filters come from the form
      const filters = {
        role: payload.role,
        roleAddress: payload.roleAddress,
        validateOnChain: payload.validateOnChain ?? true,
        type: payload.type === "all" ? undefined : payload.type,
        ...(payload.page !== undefined && { page: payload.page }),
        ...(payload.orderDirection && {
          orderDirection: payload.orderDirection,
        }),
        ...(payload.orderBy && { orderBy: payload.orderBy }),
        ...(payload.startDate && { startDate: payload.startDate }),
        ...(payload.endDate && { endDate: payload.endDate }),
        ...(payload.maxAmount !== undefined && {
          maxAmount: payload.maxAmount,
        }),
        ...(payload.minAmount !== undefined && {
          minAmount: payload.minAmount,
        }),
        ...(payload.isActive !== undefined && { isActive: payload.isActive }),
        ...(payload.title && { title: payload.title }),
        ...(payload.engagementId && { engagementId: payload.engagementId }),
        ...(payload.status && { status: payload.status }),
      } as GetEscrowsFromIndexerByRoleParams;

      const escrowData = await getEscrowsByRole(filters);

      if (!escrowData) {
        throw new Error("No escrow data received");
      }

      // Handle the response properly - the SDK returns an array of escrows
      setResponse(escrowData);
      toast.success("Escrow data fetched successfully");
    } catch (error: unknown) {
      const mappedError = handleError(error as AxiosError | WalletError);
      console.error("Error fetching escrows:", mappedError.message);
      setError(mappedError.message);
      toast.error(
        mappedError ? mappedError.message : "Failed to fetch escrow data"
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, response, error, onSubmit };
};
