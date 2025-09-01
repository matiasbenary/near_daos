import { useRouter } from "next/router";
import { useState } from "react";

import CreateProposalModal from "@/components/DetailDao/CreateProposal/CreateProposalModal";
import DAOHeader from "@/components/DetailDao/DAOHeader";
import ProposalsList from "@/components/DetailDao/ProposalsList";
import { useDAOInfo } from "@/hooks";

export default function DAOPage() {
  const router = useRouter();
  const { dao } = router.query;

  const { daoInfo } = useDAOInfo(dao as string);

  const [isCreateProposalModalOpen, setIsCreateProposalModalOpen] =
    useState(false);

  if (!daoInfo) {
    return (
      <>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-foreground/50">
            Loading DAO information...
          </div>
        </div>
      </>
    );
  }

  return (
    <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <DAOHeader
          daoInfo={daoInfo}
          onCreateProposal={() => setIsCreateProposalModalOpen(true)}
        />
        <ProposalsList daoInfo={daoInfo} />
      </div>

      <CreateProposalModal
        contractId={dao as string}
        isOpen={isCreateProposalModalOpen}
        onClose={() => setIsCreateProposalModalOpen(false)}
      />
    </main>
  );
}
