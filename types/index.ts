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

// Voting policy types
export type WeightKind = "TokenWeight" | "RoleWeight";

export type WeightOrRatio = { Weight: string } | { Ratio: [number, number] };

export interface VotePolicy {
  weight_kind: WeightKind;
  quorum: string;
  threshold: WeightOrRatio;
}

export type RoleKind = "Everyone" | { Member: string } | { Group: string[] };

export interface RolePermission {
  name: string;
  kind: RoleKind;
  permissions: string[];
  vote_policy: { [key: string]: VotePolicy };
}

export interface Policy {
  roles: RolePermission[];
  default_vote_policy: VotePolicy;
  proposal_bond: string;
  proposal_period: string;
  bounty_bond: string;
  bounty_forgiveness_period: string;
}

export type VersionedPolicy = { Default: string[] } | { Current: Policy };

export interface Config {
  name: string;
  purpose: string;
  metadata: string; // Base64 encoded
}

export interface ActionCall {
  method_name: string;
  args: string; // Base64 encoded
  deposit: string;
  gas: string;
}

export interface Bounty {
  description: string;
  token: string;
  amount: string;
  times: number;
  max_deadline: string;
}

export interface FactoryInfo {
  factory_id: string;
  auto_update: boolean;
}

export interface PolicyParameters {
  proposal_bond?: string;
  proposal_period?: string;
  bounty_bond?: string;
  bounty_forgiveness_period?: string;
}

// Legacy interfaces for backward compatibility
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
  | { ChangeConfig: { config: Config } }
  | { ChangePolicy: { policy: VersionedPolicy } }
  | { AddMemberToRole: { member_id: string; role: string } }
  | { RemoveMemberFromRole: { member_id: string; role: string } }
  | { FunctionCall: { receiver_id: string; actions: ActionCall[] } }
  | { UpgradeSelf: { hash: string } }
  | {
      UpgradeRemote: { receiver_id: string; method_name: string; hash: string };
    }
  | {
      Transfer: {
        token_id: string;
        receiver_id: string;
        amount: string;
        msg?: string;
      };
    }
  | { SetStakingContract: { staking_id: string } }
  | { AddBounty: { bounty: Bounty } }
  | { BountyDone: { bounty_id: number; receiver_id: string } }
  | { FactoryInfoUpdate: { factory_info: FactoryInfo } }
  | { ChangePolicyAddOrUpdateRole: { role: RolePermission } }
  | { ChangePolicyRemoveRole: { role: string } }
  | { ChangePolicyUpdateDefaultVotePolicy: { vote_policy: VotePolicy } }
  | { ChangePolicyUpdateParameters: { parameters: PolicyParameters } }
  | "Vote";

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

// //transfer
// {
//   "proposal": {
//     "description": "asdaasd",
//     "kind": {
//       "Transfer": {
//         "token_id": "",Si no se coloca nada es near
//         "receiver_id": "gagdiez.near",
//         "amount": "9000000000000000000000000"
//       }
//     }
//   }
// }
// Function call
// {
//   "proposal": {
//     "description": "qwe",
//     "kind": {
//       "FunctionCall": {
//         "receiver_id": "flipcoin.near",
//         "actions": [
//           {
//             "method_name": "mix",
//             "args": "e2FzZDoxMjN9",
//             "deposit": "1000000000000000000000000",
//             "gas": "270000000000000"
//           }
//         ]
//       }
//     }
//   }
// }

// Add member to role
// {
//   "proposal": {
//     "description": "asd",
//     "kind": {
//       "AddMemberToRole": {
//         "member_id": "gagdiez.near",
//         "role": "council"
//       }
//     }
//   }
// }

//Remove member from role

// {
//   "proposal": {
//     "description": "asd",
//     "kind": {
//       "RemoveMemberFromRole": {
//         "member_id": "aurorasupport.near",
//         "role": "council"
//       }
//     }
//   }
// }
