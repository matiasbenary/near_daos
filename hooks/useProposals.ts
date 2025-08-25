import { useEffect, useState } from "react";
import { useWalletSelector } from "@near-wallet-selector/react-hook";

import { Proposal } from "@/types";

export function useProposals(dao: string | string[] | undefined) {
  const { viewFunction } = useWalletSelector();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProposals, setTotalProposals] = useState(0);
  const proposalsPerPage = 9;

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
    updateProposals();
  }, [dao, viewFunction, currentPage]);

  const updateProposals = async () => {
    await fetchProposals(currentPage);
  };

  return {
    proposals,
    isLoadingProposals,
    currentPage,
    setCurrentPage,
    totalProposals,
    proposalsPerPage,
    updateProposals,
  };
}
