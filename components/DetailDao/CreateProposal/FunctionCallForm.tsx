import type {
  ProposalFormData,
  ProposalKind,
} from "@/components/DetailDao/CreateProposal/types";
import type { Control, FieldErrors } from "react-hook-form";

import { Controller } from "react-hook-form";
import { Input } from "@heroui/input";

interface Props {
  control: Control<ProposalFormData>;
  errors: FieldErrors<ProposalFormData>;
}

export default function FunctionCallForm({ control, errors }: Props) {
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
            placeholder="contract.near"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
        rules={{ required: "Receiver is required" }}
      />
      <Controller
        control={control}
        name="method_name"
        render={({ field }) => (
          <Input
            errorMessage={errors.method_name?.message}
            isInvalid={!!errors.method_name}
            label="Method Name"
            placeholder="method_name"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
        rules={{ required: "Method name is required" }}
      />
      <Controller
        control={control}
        name="args"
        render={({ field }) => (
          <Input
            errorMessage={errors.args?.message}
            isInvalid={!!errors.args}
            label="Args (base64)"
            placeholder="e2tleTogInZhbHVlIn0="
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
        rules={{ required: "Base64-encoded args are required" }}
      />
      <Controller
        control={control}
        name="deposit"
        render={({ field }) => (
          <Input
            errorMessage={errors.deposit?.message}
            isInvalid={!!errors.deposit}
            label="Deposit (yoctoNEAR)"
            placeholder="0"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
        rules={{ required: "Deposit (yoctoNEAR) is required" }}
      />
      <Controller
        control={control}
        name="gas"
        render={({ field }) => (
          <Input
            errorMessage={errors.gas?.message}
            isInvalid={!!errors.gas}
            label="Gas (yocto)"
            placeholder="270000000000000"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
        rules={{ required: "Gas (yocto) is required" }}
      />
    </div>
  );
}

export function buildFunctionCallKind(data: ProposalFormData): ProposalKind {
  return {
    FunctionCall: {
      receiver_id: data.receiver_id!,
      actions: [
        {
          method_name: data.method_name!,
          args: data.args!,
          deposit: data.deposit!,
          gas: data.gas!,
        },
      ],
    },
  } as const;
}
