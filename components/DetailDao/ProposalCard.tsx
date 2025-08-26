import { Card, CardBody } from "@heroui/card";
import MDEditor from "@uiw/react-md-editor";

import VotingActions from "./VotingActions";

import { formatProposalKind, formatTimestamp, getStatusColor } from "@/utils";
import { Proposal, DAOInfo } from "@/types";

interface ProposalCardProps {
  proposal: Proposal;
  daoInfo: DAOInfo | null;
  updateProposals: () => Promise<void>;
}

export default function ProposalCard({
  proposal,
  daoInfo,
  updateProposals,
}: ProposalCardProps) {
  return (
    <Card key={proposal.id} className="bg-content2/50 h-fit">
      <CardBody className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Proposal #{proposal.id}</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}
            >
              {proposal.status}
            </span>
          </div>
          <div className="text-foreground/80 mb-3 max-h-32 overflow-hidden">
            <MDEditor.Markdown
              source={proposal.description}
              style={{
                whiteSpace: "pre-wrap",
                backgroundColor: "transparent",
                padding: 0,
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            />
          </div>
          <div className="text-sm text-foreground/60 space-y-1">
            <div>Type: {formatProposalKind(proposal.kind)}</div>
            <div>Proposer: {proposal.proposer}</div>
            <div>Submitted: {formatTimestamp(proposal.submission_time)}</div>
            <div>
              Closes:{" "}
              {formatTimestamp(
                (
                  BigInt(proposal.submission_time) +
                  (daoInfo?.proposalPeriod || BigInt(0))
                ).toString(),
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-foreground/60">
            <div className="font-medium mb-2">Votes:</div>
            <div className="space-y-1">
              <div className="text-success">
                ✓ {proposal.vote_counts?.council?.[0] || 0} Approve
              </div>
              <div className="text-danger">
                ✗ {proposal.vote_counts?.council?.[1] || 0} Reject
              </div>
              <div className="text-warning">
                ⚠ {proposal.vote_counts?.council?.[2] || 0} Remove
              </div>
            </div>
          </div>
        </div>

        <VotingActions
          daoInfo={daoInfo}
          proposal={proposal}
          updateProposals={updateProposals}
        />
      </CardBody>
    </Card>
  );
}
