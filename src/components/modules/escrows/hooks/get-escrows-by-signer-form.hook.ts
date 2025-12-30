import { useWalletContext } from "@/components/tw-blocks/wallet-kit/WalletProvider";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { WalletError } from "@/@types/errors.entity";
import {
  GetEscrowsFromIndexerResponse,
  GetEscrowsFromIndexerBySignerParams,
} from "@trustless-work/escrow/types";
import { useGetEscrowsFromIndexerBySigner } from "@trustless-work/escrow/hooks";
import { formSchema } from "../schemas/get-escrows-by-signer.schema";

export const useGetEscrowsBySignerForm = () => {
  const { walletAddress } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<
    GetEscrowsFromIndexerResponse[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const { getEscrowsBySigner } = useGetEscrowsFromIndexerBySigner();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      signer: walletAddress || "Connect your wallet to get your address",
      page: 1,
      orderDirection: "desc",
      orderBy: "createdAt",
      validateOnChain: true,
      type: "all",
    },
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Build filters object with proper typing - all filters come from the form
      const filters = {
        signer: payload.signer,
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
      } as GetEscrowsFromIndexerBySignerParams;

      const escrowData = await getEscrowsBySigner(filters);

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
