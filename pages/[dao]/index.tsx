import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import CreateProposalModal from "@/components/DetailDao/CreateProposal/CreateProposalModal";
import DAOHeader from "@/components/DetailDao/DAOHeader";
import ProposalsList from "@/components/DetailDao/ProposalsList";
import { useDAOInfo } from "@/hooks";

function DAOPageContent() {
  const router = useRouter();
  const { dao } = router.query;

  const { daoInfo, loading, error } = useDAOInfo(dao as string);

  const [isCreateProposalModalOpen, setIsCreateProposalModalOpen] =
    useState(false);

  useEffect(() => {
    if (error) {
      router.push("/404");
    }
  }, [error, router]);

  if (loading) {
    return (
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-1 sm:pt-16">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-foreground/50">
            Loading DAO information...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return null;
  }

  if (!loading && !daoInfo) {
    return (
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-1 sm:pt-16">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-foreground/50">DAO not found</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-7xl px-6 flex-grow pt-1 sm:pt-16">
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <DAOHeader
          daoInfo={daoInfo!}
          onCreateProposal={() => setIsCreateProposalModalOpen(true)}
        />
        <ProposalsList daoInfo={daoInfo!} />
      </div>

      <CreateProposalModal
        contractId={dao as string}
        isOpen={isCreateProposalModalOpen}
        onClose={() => setIsCreateProposalModalOpen(false)}
      />
    </main>
  );
}

const DAOPage = dynamic(() => Promise.resolve(DAOPageContent), {
  ssr: false,
  loading: () => (
    <main className="container mx-auto max-w-7xl px-6 flex-grow pt-1 sm:pt-16">
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-foreground/50">Loading...</div>
      </div>
    </main>
  ),
});

export default DAOPage;
