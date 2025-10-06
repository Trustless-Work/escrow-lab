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
  MultiReleaseEscrow,
  EscrowRequestResponse,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import {
  useResolveDispute,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import { getFormSchema } from "../../schemas/resolve-dispute-form.schema";
import { MultiReleaseResolveDisputePayload } from "@trustless-work/escrow/types";

export const useResolveDisputeMilestoneForm = () => {
  const { escrow } = useEscrowContext();
  const { setEscrow } = useEscrowContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<EscrowRequestResponse | null>(null);
  const { walletAddress } = useWalletContext();
  const { resolveDispute } = useResolveDispute();
  const { sendTransaction } = useSendTransaction();

  // Compose schema: required fields + distributions schema
  const multiSchema = z
    .object({
      contractId: z.string().min(1, { message: "Contract ID is required." }),
      disputeResolver: z.string().min(1, {
        message: "Dispute Resolver is required.",
      }),
      milestoneIndex: z.string().min(1, {
        message: "Milestone index is required.",
      }),
    })
    .and(getFormSchema());
  type MultiFormValues = z.infer<typeof multiSchema>;

  const form = useForm<MultiFormValues>({
    resolver: zodResolver(multiSchema),
    defaultValues: {
      contractId: escrow?.contractId || "",
      disputeResolver: escrow?.roles.disputeResolver || "",
      milestoneIndex: "",
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

  const onSubmit = async (payload: MultiFormValues) => {
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
      ) as MultiReleaseResolveDisputePayload["distributions"];

      const finalPayload: MultiReleaseResolveDisputePayload = {
        contractId: payload.contractId,
        disputeResolver: payload.disputeResolver,
        milestoneIndex:
          payload.milestoneIndex as unknown as MultiReleaseResolveDisputePayload["milestoneIndex"],
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
        "multi-release"
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
          (sum: number, d: { address: string; amount: number }) =>
            sum + d.amount,
          0
        );
        const escrowUpdated: MultiReleaseEscrow = {
          ...escrow,
          balance: escrow.balance - totalReleased,
          milestones: (escrow.milestones as MultiReleaseMilestone[]).map(
            (m, index) =>
              index === parseInt(payload.milestoneIndex)
                ? {
                    ...m,
                    flags: { ...m.flags, disputed: false, resolved: true },
                  }
                : m
          ),
        };

        setEscrow(escrowUpdated);

        toast.success(
          `Dispute Resolved in Milestone ${
            (escrow.milestones as MultiReleaseMilestone[])[
              parseInt(payload.milestoneIndex)
            ].description
          }`
        );
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
