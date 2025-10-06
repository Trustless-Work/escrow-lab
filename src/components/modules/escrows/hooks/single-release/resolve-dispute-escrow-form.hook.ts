import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEscrowContext } from "@/providers/escrow.provider";
import { toast } from "sonner";
import { useWalletContext } from "@/providers/wallet.provider";
import { signTransaction } from "../../../auth/helpers/stellar-wallet-kit.helper";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { WalletError } from "@/@types/errors.entity";
import {
  SingleReleaseEscrow,
  EscrowRequestResponse,
} from "@trustless-work/escrow/types";
import {
  useResolveDispute,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import { getFormSchema } from "../../schemas/resolve-dispute-form.schema";
import { SingleReleaseResolveDisputePayload } from "@trustless-work/escrow/types";

export const useResolveDisputeEscrowForm = () => {
  const { escrow } = useEscrowContext() as {
    escrow: SingleReleaseEscrow | null;
  };
  const { setEscrow } = useEscrowContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<EscrowRequestResponse | null>(null);
  const { walletAddress } = useWalletContext();
  const { resolveDispute } = useResolveDispute();
  const { sendTransaction } = useSendTransaction();

  // Compose schema: required fields + distributions schema
  const singleSchema = z
    .object({
      contractId: z.string().min(1, { message: "Contract ID is required." }),
      disputeResolver: z.string().min(1, {
        message: "Dispute Resolver is required.",
      }),
    })
    .and(getFormSchema());
  type SingleFormValues = z.infer<typeof singleSchema>;

  const form = useForm<SingleFormValues>({
    resolver: zodResolver(singleSchema),
    defaultValues: {
      contractId: escrow?.contractId || "",
      disputeResolver: escrow?.roles.disputeResolver || "",
      distributions: [
        {
          address: escrow?.roles.approver || "",
          amount: "",
        },
        {
          address: escrow?.roles.receiver || "",
          amount: "",
        },
      ],
    },
  });

  const onSubmit = async (payload: SingleFormValues) => {
    setLoading(true);
    setResponse(null);

    try {
      const normalizedDistributions = payload.distributions.map(
        (d: { address: string; amount: string | number }) => ({
          address: d.address,
          amount:
            typeof d.amount === "string"
              ? d.amount === "" || d.amount === "."
                ? 0
                : parseFloat(d.amount)
              : d.amount,
        })
      ) as SingleReleaseResolveDisputePayload["distributions"]; // ensure exact type

      const finalPayload: SingleReleaseResolveDisputePayload = {
        contractId: payload.contractId,
        disputeResolver: payload.disputeResolver,
        distributions: normalizedDistributions,
      };

      /**
       * API call by using the trustless work hooks
       * @Note:
       * - We need to pass the payload to the resolveDispute function
       * - The result will be an unsigned transaction
       */
      const { unsignedTransaction } = await resolveDispute(
        finalPayload,
        "single-release"
      );

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from resolveDispute response."
        );
      }

      /**
       * @Note:
       * - We need to sign the transaction using your private key
       * - The result will be a signed transaction
       */
      const signedXdr = await signTransaction({
        unsignedTransaction,
        address: walletAddress || "",
      });

      if (!signedXdr) {
        throw new Error("Signed transaction is missing.");
      }

      /**
       * @Note:
       * - We need to send the signed transaction to the API
       * - The data will be an SendTransactionResponse
       */
      const data = await sendTransaction(signedXdr);

      /**
       * @Responses:
       * data.status === "SUCCESS"
       * - Escrow updated successfully
       * - Set the escrow in the context
       * - Show a success toast
       *
       * data.status == "ERROR"
       * - Show an error toast
       */
      if (data.status === "SUCCESS" && escrow) {
        const totalReleased = normalizedDistributions.reduce(
          (acc: number, d: { address: string; amount: number }) =>
            acc + d.amount,
          0
        );
        const escrowUpdated: SingleReleaseEscrow = {
          ...escrow,
          flags: {
            ...escrow.flags,
            resolved: true,
          },
          balance: escrow.balance - totalReleased,
        };

        setEscrow(escrowUpdated);

        toast.success(`Dispute Resolved in ${escrowUpdated.title}`);
        setResponse(data);
      }
    } catch (error: unknown) {
      const mappedError = handleError(error as AxiosError | WalletError);
      console.error("Error:", mappedError.message);

      toast.error(
        mappedError ? mappedError.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, response, onSubmit };
};
