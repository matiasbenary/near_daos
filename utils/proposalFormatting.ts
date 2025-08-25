import { Proposal } from "@/types";

export const formatProposalKind = (kind: Proposal["kind"]): string => {
  if (typeof kind === "string" && kind === "Vote") {
    return "Vote";
  }
  if ("UpgradeRemote" in kind) {
    return `Upgrade Remote: ${kind.UpgradeRemote.receiver_id}`;
  }
  if ("FunctionCall" in kind) {
    return `Function Call: ${kind.FunctionCall.receiver_id}`;
  }
  if ("ChangeConfig" in kind) {
    return "Change Config";
  }
  if ("ChangePolicy" in kind) {
    return "Change Policy";
  }
  if ("AddMemberToRole" in kind) {
    return `Add Member: ${kind.AddMemberToRole.member_id} to ${kind.AddMemberToRole.role}`;
  }
  if ("RemoveMemberFromRole" in kind) {
    return `Remove Member: ${kind.RemoveMemberFromRole.member_id} from ${kind.RemoveMemberFromRole.role}`;
  }
  if ("UpgradeSelf" in kind) {
    return "Upgrade Self";
  }
  if ("Transfer" in kind) {
    return `Transfer: ${kind.Transfer.amount} ${kind.Transfer.token_id} to ${kind.Transfer.receiver_id}`;
  }
  if ("SetStakingContract" in kind) {
    return `Set Staking Contract: ${kind.SetStakingContract.staking_id}`;
  }
  if ("AddBounty" in kind) {
    return "Add Bounty";
  }
  if ("BountyDone" in kind) {
    return `Bounty Done: ${kind.BountyDone.bounty_id}`;
  }
  if ("FactoryInfoUpdate" in kind) {
    return "Factory Info Update";
  }
  if ("ChangePolicyAddOrUpdateRole" in kind) {
    return `Change Policy: Add/Update Role ${kind.ChangePolicyAddOrUpdateRole.role.name}`;
  }
  if ("ChangePolicyRemoveRole" in kind) {
    return `Change Policy: Remove Role ${kind.ChangePolicyRemoveRole.role}`;
  }
  if ("ChangePolicyUpdateDefaultVotePolicy" in kind) {
    return "Change Policy: Update Default Vote Policy";
  }
  if ("ChangePolicyUpdateParameters" in kind) {
    return "Change Policy: Update Parameters";
  }

  return "Unknown";
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp) / 1000000);

  return date.toLocaleDateString();
};

export const getStatusColor = (status: Proposal["status"]): string => {
  switch (status) {
    case "Approved":
      return "text-success";
    case "Rejected":
      return "text-danger";
    case "InProgress":
      return "text-warning";
    default:
      return "text-foreground";
  }
};
