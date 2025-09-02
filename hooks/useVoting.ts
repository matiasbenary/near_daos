import { useState } from "react";
import { useWalletSelector } from "@near-wallet-selector/react-hook";

import { Proposal, VoteOption } from "@/types";

export function useVoting(
  dao: string | string[] | undefined,
  councilMembers: string[],
  proposalPeriod: bigint,
  updateView: () => Promise<void>,
) {
  const { callFunction, signedAccountId } = useWalletSelector();
  const [votingProposalId, setVotingProposalId] = useState<number | null>(null);

  const handleVote = async (proposalId: number, vote: VoteOption) => {
    if (!signedAccountId || !dao) return;

    try {
      setVotingProposalId(proposalId);

      // Convert client vote option to contract action
      const voteActionMap = {
        Approve: "VoteApprove",
        Reject: "VoteReject",
        Remove: "VoteRemove",
      } as const;

      await callFunction({
        contractId: dao as string,
        method: "act_proposal",
        args: {
          id: proposalId,
          action: voteActionMap[vote],
        },
        gas: "100000000000000", // 100 TGas
        deposit: "0",
      });

      // Refresh current page after voting
      await updateView();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error voting on proposal:", error);
    } finally {
      setVotingProposalId(null);
    }
  };

  const hasUserVoted = (proposal: Proposal): boolean => {
    return signedAccountId ? signedAccountId in proposal.votes : false;
  };

  const getUserVote = (proposal: Proposal): VoteOption | null => {
    return signedAccountId && signedAccountId in proposal.votes
      ? proposal.votes[signedAccountId]
      : null;
  };

  const canUserVote = (proposal: Proposal): boolean => {
    return (
      (signedAccountId &&
        proposal.status === "InProgress" &&
        BigInt(Date.now()) * BigInt(1e6) <
          BigInt(proposal.submission_time) + proposalPeriod &&
        councilMembers.includes(signedAccountId)) ||
      false
    );
  };

  return {
    votingProposalId,
    handleVote,
    hasUserVoted,
    getUserVote,
    canUserVote,
  };
}
