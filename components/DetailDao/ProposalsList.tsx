import { Pagination } from "@heroui/pagination";

import ProposalCard from "./ProposalCard";

import { DAOInfo } from "@/types";
import { useProposals } from "@/hooks";

interface ProposalsListProps {
  daoInfo: DAOInfo | null;
}

export default function ProposalsList({ daoInfo }: ProposalsListProps) {
  const {
    proposals,
    isLoadingProposals,
    currentPage,
    totalProposals,
    proposalsPerPage,
    setCurrentPage,
    updateProposals,
  } = useProposals(daoInfo?.contract as string);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-primary mb-6 mt-8 text-center">
        Proposals
      </h2>

      {isLoadingProposals ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-foreground/50">Loading proposals...</div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center text-foreground/50 py-8">
          No proposals found for this DAO.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              daoInfo={daoInfo}
              proposal={proposal}
              updateProposals={updateProposals}
            />
          ))}
        </div>
      )}

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
  );
}
