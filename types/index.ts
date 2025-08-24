import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// DAO Proposal Types
export type ProposalStatus =
  | "Approved"
  | "Rejected"
  | "InProgress"
  | "Removed"
  | "Expired"
  | "Moved";

export type VoteOption = "Approve" | "Reject" | "Remove";

export interface VoteCounts {
  council: [number, number, number]; // [approve, reject, remove]
}

export interface Votes {
  [accountId: string]: VoteOption;
}

export interface UpgradeRemoteAction {
  receiver_id: string;
  method_name: string;
  hash: string;
}

export interface FunctionCallAction {
  method_name: string;
  args: string; // Base64 encoded arguments
  deposit: string;
  gas: string;
}

export interface FunctionCallKind {
  receiver_id: string;
  actions: FunctionCallAction[];
}

export type ProposalKind =
  | { UpgradeRemote: UpgradeRemoteAction }
  | { FunctionCall: FunctionCallKind };

export interface Proposal {
  id: number;
  proposer: string;
  description: string;
  kind: ProposalKind;
  status: ProposalStatus;
  vote_counts: VoteCounts;
  votes: Votes;
  submission_time: string; // Nanosecond timestamp as string
}

export interface DAOInfo {
  name: string;
  bond: string;
  votingTime: string;
  councilMembers: string[];
}

// Voting action types
export interface VoteAction {
  proposalId: number;
  action: VoteOption;
}
