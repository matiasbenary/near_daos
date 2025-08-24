import { useRouter } from "next/router";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { useEffect, useState } from "react";
import { useWalletSelector } from "@near-wallet-selector/react-hook";

import DefaultLayout from "@/layouts/default";
import CreateProposalModal from "@/components/CreateProposalModal";
import { DAOInfo, Proposal, VoteOption } from "@/types";

export default function DAOPage() {
  const { callFunction, viewFunction, signedAccountId } = useWalletSelector();
  const router = useRouter();
  const { dao } = router.query;
  const [daoInfo, setDaoInfo] = useState<DAOInfo | null>(null);
  const [isCreateProposalModalOpen, setIsCreateProposalModalOpen] =
    useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);
  const [votingProposalId, setVotingProposalId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProposals, setTotalProposals] = useState(0);
  const proposalsPerPage = 9;

  useEffect(() => {
    if (dao && typeof dao === "string") {
      const mockDaoInfo: DAOInfo = {
        name: dao.replace(/[-_]/g, " ").replace(/\..*$/, ""),
        bond: "1 N",
        votingTime: "7 days",
        councilMembers: ["gagdiez.near"],
      };

      setDaoInfo(mockDaoInfo);
    }
  }, [dao]);

  const fetchProposals = async (page: number = 1) => {
    if (!dao || typeof dao !== "string") return;

    try {
      setIsLoadingProposals(true);

      // Calculate from_index for pagination (NEAR uses 0-based indexing)
      const fromIndex = (page - 1) * proposalsPerPage;

      // Fetch proposals for current page
      const proposalsData = await viewFunction({
        contractId: dao as string,
        method: "get_proposals",
        args: { from_index: fromIndex, limit: proposalsPerPage },
      });

      // Fetch total proposal count
      const totalCount = await viewFunction({
        contractId: dao as string,
        method: "get_last_proposal_id",
        args: {},
      });

      setProposals((proposalsData as Proposal[]) || []);
      setTotalProposals((totalCount as number) || 0);
    } catch {
      setProposals([]);
      setTotalProposals(0);
    } finally {
      setIsLoadingProposals(false);
    }
  };

  useEffect(() => {
    fetchProposals(currentPage);
  }, [dao, viewFunction, currentPage]);

  const formatProposalKind = (kind: Proposal["kind"]): string => {
    if ("UpgradeRemote" in kind) {
      return `Upgrade Remote: ${kind.UpgradeRemote.receiver_id}`;
    }
    if ("FunctionCall" in kind) {
      return `Function Call: ${kind.FunctionCall.receiver_id}`;
    }

    return "Unknown";
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp) / 1000000);

    return date.toLocaleDateString();
  };

  const getStatusColor = (status: Proposal["status"]): string => {
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

  const handleVote = async (proposalId: number, vote: VoteOption) => {
    if (!signedAccountId || !dao) return;

    try {
      setVotingProposalId(proposalId);

      await callFunction({
        contractId: dao as string,
        method: "act_proposal",
        args: {
          id: proposalId,
          action: vote,
        },
        gas: "100000000000000", // 100 TGas
        deposit: "0",
      });

      // Refresh current page after voting
      await fetchProposals(currentPage);
    } catch {
      // Handle error silently for now
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
        daoInfo?.councilMembers.includes(signedAccountId)) ||
      false
    );
  };

  if (!daoInfo) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-foreground/50">
            Loading DAO information...
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <Card className="w-full max-w-2xl bg-content1/80 backdrop-blur-sm shadow-lg">
          <CardBody className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-primary mb-6 capitalize">
              {daoInfo.name}.dao.poolparty.near
            </h1>

            <p className="text-foreground/70 mb-8 text-lg">
              The current bond is{" "}
              <span className="text-primary font-semibold">{daoInfo.bond}</span>
              , and the voting time for proposals is{" "}
              <span className="text-primary font-semibold">
                {daoInfo.votingTime}
              </span>
              .
            </p>

            {/* Council Members */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Council Members
              </h2>
              <div className="space-y-2">
                {daoInfo.councilMembers.map((member, index) => (
                  <div key={index} className="text-foreground font-medium">
                    {member}
                  </div>
                ))}
              </div>
            </div>

            {/* Create Proposal Button */}
            <div className="space-y-4">
              <Button
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-primary-foreground bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 transition-all duration-200"
                size="lg"
                onPress={() => setIsCreateProposalModalOpen(true)}
              >
                Create a proposal
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Proposals Section */}
        <h2 className="text-3xl font-bold text-primary mb-6 mt-8">Proposals</h2>
        {isLoadingProposals ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-lg text-foreground/50">
              Loading proposals...
            </div>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center text-foreground/50 py-8">
            No proposals found for this DAO.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="bg-content2/50 h-fit">
                <CardBody className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">
                        Proposal #{proposal.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}
                      >
                        {proposal.status}
                      </span>
                    </div>
                    <p className="text-foreground/80 mb-3 line-clamp-3">
                      {proposal.description}
                    </p>
                    <div className="text-sm text-foreground/60 space-y-1">
                      <div>Type: {formatProposalKind(proposal.kind)}</div>
                      <div>Proposer: {proposal.proposer}</div>
                      <div>
                        Submitted: {formatTimestamp(proposal.submission_time)}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-foreground/60">
                      <div className="font-medium mb-2">Votes:</div>
                      <div className="space-y-1">
                        <div className="text-success">
                          ✓ {proposal.vote_counts.council[0]} Approve
                        </div>
                        <div className="text-danger">
                          ✗ {proposal.vote_counts.council[1]} Reject
                        </div>
                        <div className="text-warning">
                          ⚠ {proposal.vote_counts.council[2]} Remove
                        </div>
                      </div>
                    </div>
                  </div>

                  {signedAccountId && (
                    <div className="pt-4 border-t border-divider">
                      {hasUserVoted(proposal) ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground/60">
                            Your vote:
                          </span>
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
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalProposals > proposalsPerPage && (
          <div className="flex justify-center mt-8">
            <Pagination
              showControls
              showShadow
              color="primary"
              page={currentPage}
              total={Math.ceil(totalProposals / proposalsPerPage)}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <CreateProposalModal
        contractId={dao as string}
        isOpen={isCreateProposalModalOpen}
        onClose={() => setIsCreateProposalModalOpen(false)}
      />
    </DefaultLayout>
  );
}
