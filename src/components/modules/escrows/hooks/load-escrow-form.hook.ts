import { useEscrowContext } from "@/providers/escrow.provider";
import { useWalletContext } from "@/providers/wallet.provider";
import { useTabsContext } from "@/providers/tabs.provider";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { WalletError } from "@/@types/errors.entity";
import { useGetEscrowFromIndexerByContractIds } from "@trustless-work/escrow/hooks";
import { formSchema } from "../schemas/get-escrows-by-contract-ids.schema";
import {
  buildMultiEscrowFromResponse,
  buildSingleEscrowFromResponse,
  normalizeIndexerToInitializeResponse,
} from "@/helpers/build-escrow-from-response.helper";
import {
  GetEscrowsFromIndexerResponse,
  InitializeMultiReleaseEscrowResponse,
  InitializeSingleReleaseEscrowResponse,
} from "@trustless-work/escrow";
import { useDialogsContext } from "@/providers/dialogs.provider";

export const useLoadEscrowForm = () => {
  const { setEscrow } = useEscrowContext();
  const { walletAddress } = useWalletContext();
  const { setLoadEscrowDialogOpen } = useDialogsContext();
  const { setActiveEscrowType, setActiveTab } = useTabsContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractIds: [{ value: "" }],
      validateOnChain: true,
    },
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);

    try {
      const data = (await getEscrowByContractIds({
        contractIds: payload.contractIds.map((item) => item.value),
        validateOnChain: true,
      })) as unknown as GetEscrowsFromIndexerResponse[];

      const escrowData = data[0];

      if (!escrowData) {
        throw new Error("No escrow data received");
      }

      const normalized = normalizeIndexerToInitializeResponse(escrowData);

      if (escrowData.type === "single-release") {
        setActiveEscrowType("single-release");
        const escrow = buildSingleEscrowFromResponse(
          normalized as InitializeSingleReleaseEscrowResponse,
          walletAddress || ""
        );
        setEscrow(escrow);
        setActiveTab("escrow");
      } else {
        setActiveEscrowType("multi-release");
        const escrow = buildMultiEscrowFromResponse(
          normalized as InitializeMultiReleaseEscrowResponse,
          walletAddress || ""
        );
        setEscrow(escrow);
        setActiveTab("escrow");
      }

      setLoadEscrowDialogOpen(false);
      toast.success("Escrow data fetched successfully");
    } catch (error: unknown) {
      const mappedError = handleError(error as AxiosError | WalletError);
      console.error("Error fetching escrow:", mappedError.message);
      setError(mappedError.message);
      toast.error(
        mappedError ? mappedError.message : "Failed to fetch escrow data"
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, error, onSubmit };
};
