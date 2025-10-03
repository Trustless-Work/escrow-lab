import { useWalletContext } from "@/providers/wallet.provider";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEscrowContext } from "@/providers/escrow.provider";
import { useTabsContext } from "@/providers/tabs.provider";
import { z } from "zod";
import { Resolver } from "react-hook-form";
import { buildMultiEscrowFromResponse } from "@/helpers/build-escrow-from-response.helper";
import { handleError } from "@/errors/utils/handle-errors";
import { AxiosError } from "axios";
import { WalletError } from "@/@types/errors.entity";
import {
  useInitializeEscrow as useInitializeEscrowHook,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import {
  InitializeMultiReleaseEscrowPayload,
  InitializeMultiReleaseEscrowResponse,
} from "@trustless-work/escrow/types";
import { formSchemaMultiRelease } from "../../schemas/initialize-escrow-form.schema";
import { trustlines } from "../../constants/trustline.constant";
import { signTransaction } from "@/components/modules/auth/helpers/stellar-wallet-kit.helper";
import { steps } from "../../constants/initialize-steps.constant";

type FormValues = z.infer<typeof formSchemaMultiRelease>;

export const useInitializeMultiEscrowForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] =
    useState<InitializeMultiReleaseEscrowResponse | null>(null);
  const { walletAddress } = useWalletContext();
  const { setEscrow } = useEscrowContext();
  const { setActiveTab } = useTabsContext();

  const { deployEscrow } = useInitializeEscrowHook();
  const { sendTransaction } = useSendTransaction();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchemaMultiRelease) as Resolver<FormValues>,
    defaultValues: {
      signer: walletAddress || "",
      engagementId: "",
      title: "",
      description: "",
      platformFee: 0,
      receiverMemo: 0,
      roles: {
        approver: "",
        serviceProvider: "",
        platformAddress: "",
        releaseSigner: "",
        disputeResolver: "",
        receiver: "",
      },
      trustline: {
        address: "",
      },
      milestones: [
        {
          description: "",
          amount: 0,
        },
      ],
    },
    mode: "onChange",
  });

  const addMilestone = () => {
    const currentMilestones = form.getValues("milestones");
    form.setValue("milestones", [
      ...currentMilestones,
      { description: "", amount: 0 },
    ]);
  };

  const removeMilestone = (index: number) => {
    const currentMilestones = form.getValues("milestones");
    if (currentMilestones.length > 1) {
      form.setValue(
        "milestones",
        currentMilestones.filter((_, i) => i !== index)
      );
    }
  };

  const loadTemplate = () => {
    form.setValue("title", "Sample TW Escrow");
    form.setValue(
      "description",
      "This is a sample TW escrow for testing purposes"
    );
    form.setValue("engagementId", "ENG12345");
    form.setValue("platformFee", 5);
    form.setValue("roles.approver", walletAddress || "");
    form.setValue("roles.serviceProvider", walletAddress || "");
    form.setValue("roles.platformAddress", walletAddress || "");
    form.setValue("roles.releaseSigner", walletAddress || "");
    form.setValue("roles.disputeResolver", walletAddress || "");
    form.setValue("roles.receiver", walletAddress || "");
    form.setValue("receiverMemo", 90909090);
    form.setValue(
      "trustline.address",
      trustlines.find((t) => t.name === "USDC")?.address || ""
    );
    form.setValue("milestones", [
      {
        description: "Initial milestone",
        amount: 50,
      },
      {
        description: "Second milestone",
        amount: 50,
      },
      {
        description: "Final milestone",
        amount: 100,
      },
    ]);
  };

  const onSubmit = async (payload: InitializeMultiReleaseEscrowPayload) => {
    setLoading(true);
    setResponse(null);

    try {
      // This is the final payload that will be sent to the API
      const finalPayload: InitializeMultiReleaseEscrowPayload = {
        ...payload,
        receiverMemo: payload.receiverMemo ?? 0,
        signer: walletAddress || "",
      };

      /**
       * API call by using the trustless work hooks
       * @Note:
       * - We need to pass the payload to the deployEscrow function
       * - The result will be an unsigned transaction
       */
      const { unsignedTransaction } = await deployEscrow(
        finalPayload,
        "multi-release"
      );

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from deployEscrow response."
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
       * - Escrow created successfully
       * - Set the escrow in the context
       * - Set the active tab to "escrow"
       * - Show a success toast
       *
       * data.status == "ERROR"
       * - Show an error toast
       */
      if (data && data.status === "SUCCESS") {
        const escrow = buildMultiEscrowFromResponse(
          data as InitializeMultiReleaseEscrowResponse,
          walletAddress || ""
        );
        setEscrow(escrow);
        setActiveTab("escrow");
        toast.success("Escrow Created");
      } else if (data && data.status !== "SUCCESS") {
        throw new Error(
          (data as { message?: string }).message || "Failed to create escrow"
        );
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: unknown) {
      console.error("Error:", error);

      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        try {
          const mappedError = handleError(error as AxiosError | WalletError);
          errorMessage = mappedError.message;
        } catch (handleErrorException) {
          console.error("Error in handleError:", handleErrorException);
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(fields);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getStepFields = (
    step: number
  ): (keyof z.infer<typeof formSchemaMultiRelease>)[] => {
    switch (step) {
      case 0:
        return ["title", "engagementId", "description"];
      case 1:
        return ["platformFee", "trustline", "receiverMemo"];
      case 2:
        return ["roles"];
      case 3:
        return ["milestones"];
      default:
        return [];
    }
  };

  return {
    form,
    loading,
    response,
    currentStep,
    addMilestone,
    removeMilestone,
    loadTemplate,
    onSubmit,
    nextStep,
    prevStep,
  };
};
