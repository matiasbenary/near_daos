export type ProposalType =
  | "Vote"
  | "Transfer"
  | "FunctionCall"
  | "AddMemberToRole"
  | "RemoveMemberFromRole";

export interface ProposalFormData {
  description: string;

  // Transfer
  token_id?: string;
  receiver_id?: string;
  amount?: string;

  // FunctionCall
  method_name?: string;
  args?: string; // base64
  deposit?: string; // yoctoNEAR
  gas?: string; // yocto

  // Role management
  member_id?: string;
  role?: string;
}

// Kind payload that the DAO contract expects for add_proposal
export type ProposalKind =
  | "Vote"
  | {
      Transfer: {
        token_id: string; // empty string for NEAR
        receiver_id: string;
        amount: string; // yocto
      };
    }
  | {
      FunctionCall: {
        receiver_id: string;
        actions: Array<{
          method_name: string;
          args: string; // base64-encoded JSON
          deposit: string; // yocto
          gas: string; // yocto
        }>;
      };
    }
  | {
      AddMemberToRole: {
        member_id: string;
        role: string;
      };
    }
  | {
      RemoveMemberFromRole: {
        member_id: string;
        role: string;
      };
    };

export type BuildKindFn = (data: ProposalFormData) => ProposalKind;
