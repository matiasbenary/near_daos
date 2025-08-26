import type { ProposalFormData, ProposalType, ProposalKind } from "./types";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useWalletSelector } from "@near-wallet-selector/react-hook";
import { NEAR } from "@near-js/tokens";

import MarkdownEditor from "../../MarkdownEditor";

import TransferForm, { buildTransferKind } from "./TransferForm";
import FunctionCallForm, { buildFunctionCallKind } from "./FunctionCallForm";
import AddMemberForm, { buildAddMemberKind } from "./AddMemberForm";
import RemoveMemberForm, { buildRemoveMemberKind } from "./RemoveMemberForm";

interface CreateProposalModalProps {
  contractId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PROPOSAL_TYPES: { label: string; value: ProposalType }[] = [
  { label: "Vote", value: "Vote" },
  { label: "Transfer", value: "Transfer" },
  { label: "FunctionCall", value: "FunctionCall" },
  { label: "AddMemberToRole", value: "AddMemberToRole" },
  { label: "RemoveMemberFromRole", value: "RemoveMemberFromRole" },
];

export default function CreateProposalModal({
  contractId,
  isOpen,
  onClose,
}: CreateProposalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalType, setProposalType] = useState<ProposalType>("Vote");
  const { callFunction } = useWalletSelector();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ProposalFormData>({
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: {
      description: "",
    },
  });
  const onSubmit = async (data: ProposalFormData) => {
    try {
      setIsSubmitting(true);

      // Let each component define how to build its own kind payload
      const builders: Record<
        ProposalType,
        (d: ProposalFormData) => ProposalKind
      > = {
        Vote: () => "Vote",
        Transfer: buildTransferKind,
        FunctionCall: buildFunctionCallKind,
        AddMemberToRole: buildAddMemberKind,
        RemoveMemberFromRole: buildRemoveMemberKind,
      };

      const kind = builders[proposalType](data);

      await callFunction({
        method: "add_proposal",
        args: {
          proposal: {
            description: data.description,
            kind,
          },
        },
        contractId,
        gas: 300000000000000,
        deposit: NEAR.toUnits("1"),
      });

      reset();
      onClose();
    } catch {
      // eslint-disable-next-line no-console
      console.error("Error creating proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/50",
        base: "border border-foreground/20 bg-content1",
        header: "border-b border-foreground/20",
        footer: "border-t border-foreground/20",
      }}
      isOpen={isOpen}
      placement="center"
      size="2xl"
      onClose={handleClose}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-primary">
              Create your proposal
            </h2>
          </ModalHeader>

          <ModalBody className="py-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Select
                    aria-label="Select proposal type"
                    label="Proposal Type"
                    selectedKeys={new Set([proposalType])}
                    selectionMode="single"
                    onSelectionChange={(keys) => {
                      const k = Array.from(keys as Set<string>)[0];

                      if (k) setProposalType(k as ProposalType);
                    }}
                  >
                    {PROPOSAL_TYPES.map((t) => (
                      <SelectItem key={t.value} textValue={t.label}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <MarkdownEditor
                      isRequired
                      errorMessage={errors.description?.message}
                      height={300}
                      isInvalid={!!errors.description}
                      label="Proposal Description"
                      placeholder="Describe your proposal in detail using Markdown..."
                      preview="live"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                  rules={{
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                    maxLength: {
                      value: 1000,
                      message: "Description must be less than 1000 characters",
                    },
                  }}
                />
                {/* Per-type fields */}
                {proposalType === "Transfer" && (
                  <TransferForm control={control} errors={errors} />
                )}
                {proposalType === "FunctionCall" && (
                  <FunctionCallForm control={control} errors={errors} />
                )}
                {proposalType === "AddMemberToRole" && (
                  <AddMemberForm control={control} errors={errors} />
                )}
                {proposalType === "RemoveMemberFromRole" && (
                  <RemoveMemberForm control={control} errors={errors} />
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              color="danger"
              disabled={isSubmitting}
              variant="light"
              onPress={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600"
              color="primary"
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Creating..." : "Create Proposal"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
