import { useRouter } from "next/router";
import { useState } from "react";

import DefaultLayout from "@/layouts/default";
import CreateProposalModal from "@/components/DetailDao/CreateProposal/CreateProposalModal";
import DAOHeader from "@/components/DetailDao/DAOHeader";
import ProposalsList from "@/components/DetailDao/ProposalsList";
import LoadingState from "@/components/DetailDao/LoadingState";
import { useDAOInfo } from "@/hooks";

export default function DAOPage() {
  const router = useRouter();
  const { dao } = router.query;

  const { daoInfo } = useDAOInfo(dao as string);

  const [isCreateProposalModalOpen, setIsCreateProposalModalOpen] =
    useState(false);

  if (!daoInfo) {
    return <LoadingState />;
  }

  return (
    <DefaultLayout>
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
    </DefaultLayout>
  );
}
