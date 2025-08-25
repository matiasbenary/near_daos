import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useWalletSelector } from "@near-wallet-selector/react-hook";

import MarkdownEditor from "../MarkdownEditor";

interface CreateProposalModalProps {
  contractId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ProposalFormData {
  description: string;
}

export default function CreateProposalModal({
  contractId,
  isOpen,
  onClose,
}: CreateProposalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { callFunction } = useWalletSelector();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ProposalFormData>({
    mode: "onChange",
    defaultValues: {
      description: "",
    },
  });
  const onSubmit = async (data: ProposalFormData) => {
    try {
      setIsSubmitting(true);

      await callFunction({
        method: "add_proposal",
        args: {
          proposal: {
            description: data.description,
            kind: "Vote",
          },
        },
        contractId,
        gas: 300000000000000,
        deposit: BigInt("1000000000000000000000000"),
      });

      reset();
      onClose();
    } catch {
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
              <div>
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
