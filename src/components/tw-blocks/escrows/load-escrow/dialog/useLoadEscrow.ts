import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ErrorResponse,
  handleError,
} from "@/components/tw-blocks/handle-errors/handle";
import { useGetEscrowFromIndexerByContractIds } from "@trustless-work/escrow/hooks";
import { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow/types";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { formSchema } from "./schema";
import { useTabsContext } from "@/providers/tabs.provider";

export const useLoadEscrow = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const { setSelectedEscrow } = useEscrowContext();
  const { setActiveEscrowType } = useTabsContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractIds: [{ value: "" }],
      validateOnChain: true,
    },
    mode: "onChange",
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const data = (await getEscrowByContractIds({
        contractIds: payload.contractIds.map((item) => item.value),
        validateOnChain: true,
      })) as unknown as GetEscrowsFromIndexerResponse[];

      const escrowData = data[0];

      if (!escrowData) {
        throw new Error("No escrow data received");
      }

      setSelectedEscrow(escrowData);

      setActiveEscrowType(escrowData.type);

      toast.success(
        "Escrow data fetched successfully. Now you can use the selectedEscrow state"
      );

      onSuccess?.();
    } catch (error) {
      toast.error(handleError(error as ErrorResponse).message);
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  };

  return { form, isSubmitting, onSubmit };
};
