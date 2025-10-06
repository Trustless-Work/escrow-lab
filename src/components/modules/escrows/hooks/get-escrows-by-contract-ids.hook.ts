import { useWalletContext } from "@/providers/wallet.provider";
import { useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { WalletError } from "@/@types/errors.entity";
import { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow/types";
import { useGetEscrowFromIndexerByContractIds } from "@trustless-work/escrow/hooks";
import { formSchema } from "../schemas/get-escrows-by-contract-ids.schema";

export const useGetEscrowsByContractIdsForm = () => {
  const { walletAddress } = useWalletContext();
  //   const { setEscrow } = useEscrowContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] =
    useState<GetEscrowsFromIndexerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractIds: [{ value: "" }],
      signer: walletAddress || "Connect your wallet to get your address",
      validateOnChain: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contractIds",
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const escrowData = await getEscrowByContractIds({
        contractIds: payload.contractIds.map((item) => item.value),
        signer: payload.signer,
        validateOnChain: payload.validateOnChain,
      });

      if (!escrowData) {
        throw new Error("No escrow data received");
      }

      //   setEscrow(escrowData);
      setResponse(escrowData);
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

  return { form, loading, response, error, onSubmit, fields, append, remove };
};
