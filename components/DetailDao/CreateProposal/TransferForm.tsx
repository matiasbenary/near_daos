import type {
  ProposalFormData,
  ProposalKind,
} from "@/components/DetailDao/CreateProposal/types";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Input } from "@heroui/input";

interface Props {
  control: Control<ProposalFormData>;
  errors: FieldErrors<ProposalFormData>;
}

export default function TransferForm({ control, errors }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Controller
        control={control}
        name="receiver_id"
        render={({ field }) => (
          <Input
            errorMessage={errors.receiver_id?.message}
            isInvalid={!!errors.receiver_id}
            label="Receiver ID"
            placeholder="example.near"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
        rules={{ required: "Receiver is required" }}
      />
      <Controller
        control={control}
        name="amount"
        render={({ field }) => (
          <Input
            errorMessage={errors.amount?.message}
            isInvalid={!!errors.amount}
            label="Amount (yoctoNEAR)"
            placeholder="1000000000000000000000000"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
        rules={{ required: "Amount (yoctoNEAR) is required" }}
      />
      <Controller
        control={control}
        name="token_id"
        render={({ field }) => (
          <Input
            errorMessage={errors.token_id?.message}
            isInvalid={!!errors.token_id}
            label="Token ID (optional)"
            placeholder="Leave empty for NEAR"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
}

export function buildTransferKind(data: ProposalFormData): ProposalKind {
  return {
    Transfer: {
      token_id: data.token_id ?? "",
      receiver_id: data.receiver_id!,
      amount: data.amount!,
    },
  } as const;
}
