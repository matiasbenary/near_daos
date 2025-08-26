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

export default function RemoveMemberForm({ control, errors }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Controller
        control={control}
        name="member_id"
        render={({ field }) => (
          <Input
            errorMessage={errors.member_id?.message}
            isInvalid={!!errors.member_id}
            label="Member ID"
            placeholder="user.near"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
        rules={{ required: "Member ID is required" }}
      />
      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <Input
            errorMessage={errors.role?.message}
            isInvalid={!!errors.role}
            label="Role"
            placeholder="council"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
        rules={{ required: "Role is required" }}
      />
    </div>
  );
}

export function buildRemoveMemberKind(data: ProposalFormData): ProposalKind {
  return {
    RemoveMemberFromRole: {
      member_id: data.member_id!,
      role: data.role!,
    },
  } as const;
}
