import { Button } from "@heroui/button";
import { useWalletSelector } from "@near-wallet-selector/react-hook";

import { Proposal, DAOInfo } from "@/types";
import { useVoting } from "@/hooks";

interface VotingActionsProps {
  proposal: Proposal;
  daoInfo: DAOInfo | null;
  updateProposals: () => Promise<void>;
}

export default function VotingActions({
  proposal,
  daoInfo,
  updateProposals,
}: VotingActionsProps) {
  const {
    handleVote,
    votingProposalId,
    hasUserVoted,
    getUserVote,
    canUserVote,
  } = useVoting(daoInfo?.name as string, updateProposals);
  const { signedAccountId } = useWalletSelector();

  if (!signedAccountId) {
    return null;
  }

  return (
    <div className="pt-4 border-t border-divider">
      {hasUserVoted(proposal) ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/60">Your vote:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              getUserVote(proposal) === "Approve"
                ? "bg-success/20 text-success"
                : getUserVote(proposal) === "Reject"
                  ? "bg-danger/20 text-danger"
                  : "bg-warning/20 text-warning"
            }`}
          >
            {getUserVote(proposal)}
          </span>
        </div>
      ) : canUserVote(proposal) ? (
        <div className="flex flex-col gap-2">
          <Button
            className="bg-success/10 text-success hover:bg-success/20 w-full"
            isLoading={votingProposalId === proposal.id}
            size="sm"
            onPress={() => handleVote(proposal.id, "Approve")}
          >
            ✓ Approve
          </Button>
          <Button
            className="bg-danger/10 text-danger hover:bg-danger/20 w-full"
            isLoading={votingProposalId === proposal.id}
            size="sm"
            onPress={() => handleVote(proposal.id, "Reject")}
          >
            ✗ Reject
          </Button>
          <Button
            className="bg-warning/10 text-warning hover:bg-warning/20 w-full"
            isLoading={votingProposalId === proposal.id}
            size="sm"
            onPress={() => handleVote(proposal.id, "Remove")}
          >
            ⚠ Remove
          </Button>
        </div>
      ) : (
        <div className="text-sm text-foreground/40">
          {proposal.status !== "InProgress"
            ? "Voting has ended"
            : !daoInfo?.councilMembers.includes(signedAccountId)
              ? "Only council members can vote"
              : "Unable to vote"}
        </div>
      )}
    </div>
  );
}
